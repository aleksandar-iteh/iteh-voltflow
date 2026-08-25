<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/admin/overview",
 *     operationId="getAdminOverview",
 *     tags={"Administration"},
 *     summary="Get dashboard statistics",
 *     description="Administrator only. Returns summary totals, order counts by status, and fourteen days of revenue data. Cancelled orders are excluded from revenue.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Response(response=200, description="Dashboard statistics", @OA\JsonContent(ref="#/components/schemas/AdminOverviewResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 *
 * @OA\Get(
 *     path="/admin/users",
 *     operationId="listAdminUsers",
 *     tags={"Administration"},
 *     summary="List users",
 *     description="Administrator only. Returns users ordered by creation date, including each user's order count.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, maximum=50, default=10)),
 *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1, default=1)),
 *
 *     @OA\Response(response=200, description="Paginated users", @OA\JsonContent(ref="#/components/schemas/UserListResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Invalid pagination parameters", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 */
final class AdminDocumentation {}
