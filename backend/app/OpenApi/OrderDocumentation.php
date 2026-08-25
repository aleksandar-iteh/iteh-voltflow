<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/orders",
 *     operationId="listOrders",
 *     tags={"Orders"},
 *     summary="List visible orders",
 *     description="Administrators receive all orders and may filter by user. Regular users receive only their own orders.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="status", in="query", required=false, @OA\Schema(type="string", enum={"pending","processing","shipped","delivered","cancelled"})),
 *     @OA\Parameter(name="user_id", in="query", required=false, description="Administrators may filter by any user. A regular user may only submit their own ID.", @OA\Schema(type="integer", minimum=1, example=2)),
 *     @OA\Parameter(name="sort_by", in="query", required=false, @OA\Schema(type="string", enum={"total_price","status","created_at","updated_at"}, default="created_at")),
 *     @OA\Parameter(name="sort_direction", in="query", required=false, @OA\Schema(type="string", enum={"asc","desc"}, default="desc")),
 *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, maximum=50, default=10)),
 *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1, default=1)),
 *
 *     @OA\Response(response=200, description="Paginated orders", @OA\JsonContent(ref="#/components/schemas/OrderListResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Attempted access to another user's orders", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Invalid filters", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Post(
 *     path="/orders",
 *     operationId="createOrder",
 *     tags={"Orders"},
 *     summary="Create an order",
 *     description="Regular users only. Product prices, the total, the user ID, and the initial pending status are set by the backend. Stock is decremented atomically.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/OrderCreateRequest")),
 *
 *     @OA\Response(response=201, description="Order created", @OA\JsonContent(ref="#/components/schemas/OrderMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Only regular users may create orders", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Validation error or insufficient stock", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Get(
 *     path="/orders/{order}",
 *     operationId="showOrder",
 *     tags={"Orders"},
 *     summary="Get an order",
 *     description="Administrators may view any order. Regular users may view only their own orders.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="order", in="path", required=true, description="Order ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\Response(response=200, description="Order details", @OA\JsonContent(ref="#/components/schemas/OrderResourceResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Order belongs to another user", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Order not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 *
 * @OA\Put(
 *     path="/orders/{order}",
 *     operationId="replaceOrderStatus",
 *     tags={"Orders"},
 *     summary="Update order status using PUT",
 *     description="Only the status field is accepted. Users may cancel their own pending order. Administrator transitions: pending to processing or cancelled; processing to shipped or cancelled; shipped to delivered. Cancelling restores stock.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="order", in="path", required=true, description="Order ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/OrderStatusUpdateRequest")),
 *
 *     @OA\Response(response=200, description="Status updated", @OA\JsonContent(ref="#/components/schemas/OrderMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Order access denied", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Order not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Invalid field or status transition", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Patch(
 *     path="/orders/{order}",
 *     operationId="updateOrderStatus",
 *     tags={"Orders"},
 *     summary="Update order status using PATCH",
 *     description="Only the status field is accepted. Users may cancel their own pending order. Administrator transitions: pending to processing or cancelled; processing to shipped or cancelled; shipped to delivered. Cancelling restores stock.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="order", in="path", required=true, description="Order ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/OrderStatusUpdateRequest")),
 *
 *     @OA\Response(response=200, description="Status updated", @OA\JsonContent(ref="#/components/schemas/OrderMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Order access denied", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Order not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Invalid field or status transition", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 */
final class OrderDocumentation {}
