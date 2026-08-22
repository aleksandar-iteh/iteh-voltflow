<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    private const SORTABLE_FIELDS = [
        'name',
        'price',
        'stock_quantity',
        'created_at',
        'updated_at',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'min_price' => ['sometimes', 'numeric', 'min:0'],
            'max_price' => ['sometimes', 'numeric', 'min:0', 'gte:min_price'],
            'in_stock' => ['sometimes', 'boolean'],
            'sort_by' => ['sometimes', Rule::in(self::SORTABLE_FIELDS)],
            'sort_direction' => ['sometimes', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = Product::query();

        if (! empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($validated['min_price'])) {
            $query->where('price', '>=', $validated['min_price']);
        }

        if (isset($validated['max_price'])) {
            $query->where('price', '<=', $validated['max_price']);
        }

        if (array_key_exists('in_stock', $validated)) {
            $validated['in_stock']
                ? $query->where('stock_quantity', '>', 0)
                : $query->where('stock_quantity', 0);
        }

        $products = $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products)->additional([
            'filters' => $request->only([
                'search',
                'min_price',
                'max_price',
                'in_stock',
            ]),
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
        $this->ensureAdmin($request);

        $product = Product::query()->create(
            $request->validate($this->storeRules())
        );

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $this->ensureAdmin($request);

        $product->update(
            $request->validate($this->updateRules($product))
        );

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product->refresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->ensureAdmin($request);

        return DB::transaction(function () use ($product): JsonResponse {
            $lockedProduct = Product::query()
                ->lockForUpdate()
                ->findOrFail($product->id);

            if ($lockedProduct->orderItems()->exists()) {
                return response()->json([
                    'message' => 'A product with existing orders cannot be deleted.',
                ], 409);
            }

            $lockedProduct->delete();

            return response()->json([
                'message' => 'Product deleted successfully.',
            ]);
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function storeRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:products,name'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'image_url' => ['sometimes', 'nullable', 'url:http,https', 'max:255'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function updateRules(Product $product): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($product),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock_quantity' => ['sometimes', 'required', 'integer', 'min:0'],
            'image_url' => ['sometimes', 'nullable', 'url:http,https', 'max:255'],
        ];
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->role === User::ROLE_ADMIN,
            403,
            'Only administrators can manage products.'
        );
    }
}
