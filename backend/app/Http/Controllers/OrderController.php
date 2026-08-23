<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    private const USER_TRANSITIONS = [
        Order::STATUS_PENDING => [
            Order::STATUS_CANCELLED,
        ],
    ];

    private const ADMIN_TRANSITIONS = [
        Order::STATUS_PENDING => [
            Order::STATUS_PROCESSING,
            Order::STATUS_CANCELLED,
        ],
        Order::STATUS_PROCESSING => [
            Order::STATUS_SHIPPED,
            Order::STATUS_CANCELLED,
        ],
        Order::STATUS_SHIPPED => [
            Order::STATUS_DELIVERED,
        ],
    ];

    private const SORTABLE_FIELDS = [
        'total_price',
        'status',
        'created_at',
        'updated_at',
    ];

    /**
     * Display orders visible to the authenticated user.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(Order::STATUSES)],
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'sort_by' => ['sometimes', Rule::in(self::SORTABLE_FIELDS)],
            'sort_direction' => ['sometimes', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $user = $this->authenticatedUser($request);
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        if ($user->role !== User::ROLE_ADMIN && isset($validated['user_id'])) {
            abort_unless(
                (int) $validated['user_id'] === $user->id,
                403,
                'You cannot view another user\'s orders.'
            );
        }

        $query = Order::query()->with(['user', 'items.product']);

        if ($user->role === User::ROLE_ADMIN) {
            if (isset($validated['user_id'])) {
                $query->where('user_id', $validated['user_id']);
            }
        } else {
            $query->where('user_id', $user->id);
        }

        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $orders = $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return OrderResource::collection($orders)->additional([
            'filters' => $request->only(['status', 'user_id']),
            'sort' => [
                'by' => $sortBy,
                'direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $this->authenticatedUser($request);

        abort_unless(
            $user->role === User::ROLE_USER,
            403,
            'Only regular users can create orders.'
        );

        $validated = $request->validate([
            'shipping_address' => ['required', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct:strict',
                'exists:products,id',
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.id' => ['prohibited'],
            'items.*.order_id' => ['prohibited'],
            'items.*.unit_price' => ['prohibited'],
            'user_id' => ['prohibited'],
            'total_price' => ['prohibited'],
            'status' => ['prohibited'],
        ]);

        $order = DB::transaction(function () use ($user, $validated): Order {
            $productIds = collect($validated['items'])
                ->pluck('product_id')
                ->map(fn (mixed $productId): int => (int) $productId)
                ->sort()
                ->values();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $totalPriceInCents = 0;
            $items = [];

            foreach ($validated['items'] as $index => $itemData) {
                $product = $products->get((int) $itemData['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        "items.{$index}.product_id" => ['The selected product is no longer available.'],
                    ]);
                }

                $quantity = (int) $itemData['quantity'];

                if ($quantity > $product->stock_quantity) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => [
                            "Only {$product->stock_quantity} units of {$product->name} are available.",
                        ],
                    ]);
                }

                $unitPriceInCents = (int) round((float) $product->price * 100);
                $totalPriceInCents += $unitPriceInCents * $quantity;

                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                ];

                $product->decrement('stock_quantity', $quantity);
            }

            $order = Order::query()->create([
                'user_id' => $user->id,
                'total_price' => $totalPriceInCents / 100,
                'status' => Order::STATUS_PENDING,
                'shipping_address' => $validated['shipping_address'],
            ]);

            $order->items()->createMany($items);

            return $order->load(['user', 'items.product']);
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order): OrderResource
    {
        $this->ensureCanAccess($this->authenticatedUser($request), $order);

        return new OrderResource($order->load(['user', 'items.product']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        $user = $this->authenticatedUser($request);

        $this->ensureCanAccess($user, $order);
        $this->ensureOnlyStatusIsSubmitted($request);

        $validated = $request->validate([
            'status' => ['required', Rule::in(Order::STATUSES)],
        ]);

        $order = DB::transaction(function () use ($order, $user, $validated): Order {
            $lockedOrder = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            $this->ensureCanAccess($user, $lockedOrder);

            if ($lockedOrder->status === $validated['status']) {
                return $lockedOrder->load(['user', 'items.product']);
            }

            $this->ensureTransitionIsAllowed($user, $lockedOrder, $validated['status']);

            if ($validated['status'] === Order::STATUS_CANCELLED) {
                $this->restoreStock($lockedOrder);
            }

            $lockedOrder->update(['status' => $validated['status']]);

            return $lockedOrder->refresh()->load(['user', 'items.product']);
        });

        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => new OrderResource($order),
        ]);
    }

    private function authenticatedUser(Request $request): User
    {
        /** @var User $user */
        $user = $request->user();

        return $user;
    }

    private function ensureCanAccess(User $user, Order $order): void
    {
        abort_unless(
            $user->role === User::ROLE_ADMIN || $order->user_id === $user->id,
            403,
            'You cannot access this order.'
        );
    }

    /**
     * @throws ValidationException
     */
    private function ensureTransitionIsAllowed(User $user, Order $order, string $newStatus): void
    {
        $transitions = $user->role === User::ROLE_ADMIN
            ? self::ADMIN_TRANSITIONS
            : self::USER_TRANSITIONS;

        if (! in_array($newStatus, $transitions[$order->status] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => ["The transition from {$order->status} to {$newStatus} is not allowed."],
            ]);
        }
    }

    private function restoreStock(Order $order): void
    {
        $order->loadMissing('items');

        $products = Product::query()
            ->whereIn('id', $order->items->pluck('product_id')->sort()->values())
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($order->items as $item) {
            $products->get($item->product_id)?->increment('stock_quantity', $item->quantity);
        }
    }

    /**
     * @throws ValidationException
     */
    private function ensureOnlyStatusIsSubmitted(Request $request): void
    {
        $invalidFields = array_diff(array_keys($request->all()), ['status']);

        if ($invalidFields === []) {
            return;
        }

        throw ValidationException::withMessages(
            collect($invalidFields)
                ->mapWithKeys(fn (string $field): array => [
                    $field => ['Only status can be updated on an order.'],
                ])
                ->all()
        );
    }
}
