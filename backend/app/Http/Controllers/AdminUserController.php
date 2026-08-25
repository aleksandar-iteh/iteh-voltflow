<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminUserController extends Controller
{
    /**
     * Display a paginated list of users with their order counts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(
            $request->user()?->role === User::ROLE_ADMIN,
            403,
            'Only administrators can view users.'
        );

        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $users = User::query()
            ->withCount('orders')
            ->orderByDesc('created_at')
            ->paginate((int) ($validated['per_page'] ?? 10))
            ->withQueryString();

        return UserResource::collection($users);
    }
}
