<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="VoltFlow API",
 *     version="1.0.0",
 *     description="REST API for the VoltFlow electric scooter store. Public routes expose products and authentication. Protected routes use Laravel Sanctum Bearer tokens. Product management and dashboard endpoints require an administrator account."
 * )
 *
 * @OA\Server(
 *     url="/api",
 *     description="VoltFlow API base path"
 * )
 *
 * @OA\Tag(name="Authentication", description="Registration, login, authenticated user, and logout")
 * @OA\Tag(name="Products", description="Public product catalogue and administrator product management")
 * @OA\Tag(name="Orders", description="Customer orders and status management")
 * @OA\Tag(name="Administration", description="Administrator dashboard data and user listing")
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Sanctum token",
 *     description="Enter the token returned by the register or login endpoint. Header format: Bearer {token}"
 * )
 *
 * @OA\Schema(
 *     schema="MessageResponse",
 *     type="object",
 *     required={"message"},
 *
 *     @OA\Property(property="message", type="string", example="Operation completed successfully.")
 * )
 *
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     required={"message","errors"},
 *
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(property="errors", type="object", description="Validation messages grouped by input field")
 * )
 *
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     required={"id","name","email","role","email_verified_at","created_at","updated_at"},
 *
 *     @OA\Property(property="id", type="integer", example=2),
 *     @OA\Property(property="name", type="string", example="Marko Petrovic"),
 *     @OA\Property(property="email", type="string", format="email", example="marko.petrovic@example.com"),
 *     @OA\Property(property="role", type="string", enum={"user","admin"}, example="user"),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true, example=null),
 *     @OA\Property(property="orders_count", type="integer", minimum=0, nullable=true, example=3, description="Included by the administrator user-list endpoint"),
 *     @OA\Property(property="created_at", type="string", format="date-time", nullable=true, example="2026-08-20T10:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true, example="2026-08-20T10:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     required={"id","name","description","price","stock_quantity","image_url","created_at","updated_at"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Xiaomi Electric Scooter 4 Pro (2nd Gen)"),
 *     @OA\Property(property="description", type="string", nullable=true, example="A powerful urban electric scooter with a range of up to 60 km."),
 *     @OA\Property(property="price", type="string", example="699.99", description="Decimal amount with two fractional digits"),
 *     @OA\Property(property="stock_quantity", type="integer", minimum=0, example=12),
 *     @OA\Property(property="image_url", type="string", nullable=true, example="/storage/products/scooter.webp"),
 *     @OA\Property(property="created_at", type="string", format="date-time", nullable=true, example="2026-08-20T10:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true, example="2026-08-20T10:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="OrderItem",
 *     type="object",
 *     required={"id","order_id","product_id","quantity","unit_price","created_at","updated_at","product"},
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="order_id", type="integer", example=10),
 *     @OA\Property(property="product_id", type="integer", example=1),
 *     @OA\Property(property="quantity", type="integer", minimum=1, example=2),
 *     @OA\Property(property="unit_price", type="string", example="699.99"),
 *     @OA\Property(property="created_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="product", ref="#/components/schemas/Product")
 * )
 *
 * @OA\Schema(
 *     schema="Order",
 *     type="object",
 *     required={"id","user_id","total_price","status","shipping_address","created_at","updated_at","user","items"},
 *
 *     @OA\Property(property="id", type="integer", example=10),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="total_price", type="string", example="1399.98"),
 *     @OA\Property(property="status", type="string", enum={"pending","processing","shipped","delivered","cancelled"}, example="pending"),
 *     @OA\Property(property="shipping_address", type="string", example="Bulevar kralja Aleksandra 73, Beograd"),
 *     @OA\Property(property="created_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(property="items", type="array", @OA\Items(ref="#/components/schemas/OrderItem"))
 * )
 *
 * @OA\Schema(
 *     schema="AuthResponse",
 *     type="object",
 *     required={"data","access_token","token_type"},
 *
 *     @OA\Property(property="data", ref="#/components/schemas/User"),
 *     @OA\Property(property="access_token", type="string", example="1|plain-text-sanctum-token"),
 *     @OA\Property(property="token_type", type="string", enum={"Bearer"}, example="Bearer")
 * )
 *
 * @OA\Schema(
 *     schema="UserResourceResponse",
 *     type="object",
 *     required={"data"},
 *
 *     @OA\Property(property="data", ref="#/components/schemas/User")
 * )
 *
 * @OA\Schema(
 *     schema="ProductResourceResponse",
 *     type="object",
 *     required={"data"},
 *
 *     @OA\Property(property="data", ref="#/components/schemas/Product")
 * )
 *
 * @OA\Schema(
 *     schema="OrderResourceResponse",
 *     type="object",
 *     required={"data"},
 *
 *     @OA\Property(property="data", ref="#/components/schemas/Order")
 * )
 *
 * @OA\Schema(
 *     schema="ProductMutationResponse",
 *     type="object",
 *     required={"message","data"},
 *
 *     @OA\Property(property="message", type="string", example="Product created successfully."),
 *     @OA\Property(property="data", ref="#/components/schemas/Product")
 * )
 *
 * @OA\Schema(
 *     schema="OrderMutationResponse",
 *     type="object",
 *     required={"message","data"},
 *
 *     @OA\Property(property="message", type="string", example="Order status updated successfully."),
 *     @OA\Property(property="data", ref="#/components/schemas/Order")
 * )
 *
 * @OA\Schema(
 *     schema="PaginationLink",
 *     type="object",
 *     required={"url","label","active"},
 *
 *     @OA\Property(property="url", type="string", nullable=true, example="http://localhost:8000/api/products?page=1"),
 *     @OA\Property(property="label", type="string", example="1"),
 *     @OA\Property(property="active", type="boolean", example=true)
 * )
 *
 * @OA\Schema(
 *     schema="PaginationLinks",
 *     type="object",
 *     required={"first","last","prev","next"},
 *
 *     @OA\Property(property="first", type="string", nullable=true),
 *     @OA\Property(property="last", type="string", nullable=true),
 *     @OA\Property(property="prev", type="string", nullable=true),
 *     @OA\Property(property="next", type="string", nullable=true)
 * )
 *
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     type="object",
 *     required={"current_page","from","last_page","links","path","per_page","to","total"},
 *
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="from", type="integer", nullable=true, example=1),
 *     @OA\Property(property="last_page", type="integer", example=3),
 *     @OA\Property(property="links", type="array", @OA\Items(ref="#/components/schemas/PaginationLink")),
 *     @OA\Property(property="path", type="string", example="http://localhost:8000/api/products"),
 *     @OA\Property(property="per_page", type="integer", example=10),
 *     @OA\Property(property="to", type="integer", nullable=true, example=10),
 *     @OA\Property(property="total", type="integer", example=25)
 * )
 *
 * @OA\Schema(
 *     schema="ProductListResponse",
 *     type="object",
 *     required={"data","links","meta","filters","sort"},
 *
 *     @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Product")),
 *     @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
 *     @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
 *     @OA\Property(property="filters", type="object", description="Applied search, price, and stock filters"),
 *     @OA\Property(
 *         property="sort",
 *         type="object",
 *         required={"by","direction"},
 *         @OA\Property(property="by", type="string", example="created_at"),
 *         @OA\Property(property="direction", type="string", enum={"asc","desc"}, example="desc")
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="OrderListResponse",
 *     type="object",
 *     required={"data","links","meta","filters","sort"},
 *
 *     @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Order")),
 *     @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
 *     @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
 *     @OA\Property(property="filters", type="object", description="Applied status and user filters"),
 *     @OA\Property(
 *         property="sort",
 *         type="object",
 *         required={"by","direction"},
 *         @OA\Property(property="by", type="string", example="created_at"),
 *         @OA\Property(property="direction", type="string", enum={"asc","desc"}, example="desc")
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="UserListResponse",
 *     type="object",
 *     required={"data","links","meta"},
 *
 *     @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/User")),
 *     @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
 *     @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
 * )
 *
 * @OA\Schema(
 *     schema="RegisterRequest",
 *     type="object",
 *     required={"name","email","password"},
 *
 *     @OA\Property(property="name", type="string", maxLength=255, example="Petar Petrovic"),
 *     @OA\Property(property="email", type="string", format="email", maxLength=255, example="petar@example.com"),
 *     @OA\Property(property="password", type="string", format="password", minLength=8, example="password123")
 * )
 *
 * @OA\Schema(
 *     schema="LoginRequest",
 *     type="object",
 *     required={"email","password"},
 *
 *     @OA\Property(property="email", type="string", format="email", example="marko.petrovic@example.com"),
 *     @OA\Property(property="password", type="string", format="password", example="password")
 * )
 *
 * @OA\Schema(
 *     schema="ProductCreateRequest",
 *     type="object",
 *     required={"name","price","stock_quantity"},
 *
 *     @OA\Property(property="name", type="string", maxLength=255, example="VoltFlow City Scooter"),
 *     @OA\Property(property="description", type="string", nullable=true, example="A lightweight electric scooter for city rides."),
 *     @OA\Property(property="price", type="number", format="float", minimum=0, example=749.99),
 *     @OA\Property(property="stock_quantity", type="integer", minimum=0, example=10),
 *     @OA\Property(property="image", type="string", format="binary", description="Optional JPG, JPEG, PNG, or WEBP image up to 5 MB")
 * )
 *
 * @OA\Schema(
 *     schema="ProductUpdateRequest",
 *     type="object",
 *
 *     @OA\Property(property="name", type="string", maxLength=255, example="Updated VoltFlow City Scooter"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Updated product description."),
 *     @OA\Property(property="price", type="number", format="float", minimum=0, example=799.99),
 *     @OA\Property(property="stock_quantity", type="integer", minimum=0, example=15),
 *     @OA\Property(property="image", type="string", format="binary", description="Optional replacement JPG, JPEG, PNG, or WEBP image up to 5 MB")
 * )
 *
 * @OA\Schema(
 *     schema="OrderItemInput",
 *     type="object",
 *     required={"product_id","quantity"},
 *
 *     @OA\Property(property="product_id", type="integer", minimum=1, example=1),
 *     @OA\Property(property="quantity", type="integer", minimum=1, example=2)
 * )
 *
 * @OA\Schema(
 *     schema="OrderCreateRequest",
 *     type="object",
 *     required={"shipping_address","items"},
 *
 *     @OA\Property(property="shipping_address", type="string", maxLength=255, example="Bulevar kralja Aleksandra 73, Beograd"),
 *     @OA\Property(property="items", type="array", minItems=1, @OA\Items(ref="#/components/schemas/OrderItemInput"))
 * )
 *
 * @OA\Schema(
 *     schema="OrderStatusUpdateRequest",
 *     type="object",
 *     required={"status"},
 *
 *     @OA\Property(property="status", type="string", enum={"pending","processing","shipped","delivered","cancelled"}, example="processing")
 * )
 *
 * @OA\Schema(
 *     schema="AdminOverviewResponse",
 *     type="object",
 *     required={"data"},
 *
 *     @OA\Property(
 *         property="data",
 *         type="object",
 *         required={"summary","orders_by_status","revenue_over_time"},
 *         @OA\Property(
 *             property="summary",
 *             type="object",
 *             required={"customers","products","orders","revenue"},
 *             @OA\Property(property="customers", type="integer", example=25),
 *             @OA\Property(property="products", type="integer", example=12),
 *             @OA\Property(property="orders", type="integer", example=43),
 *             @OA\Property(property="revenue", type="number", format="float", example=18499.75)
 *         ),
 *         @OA\Property(
 *             property="orders_by_status",
 *             type="array",
 *
 *             @OA\Items(
 *                 type="object",
 *                 required={"status","count"},
 *
 *                 @OA\Property(property="status", type="string", enum={"pending","processing","shipped","delivered","cancelled"}, example="pending"),
 *                 @OA\Property(property="count", type="integer", example=8)
 *             )
 *         ),
 *         @OA\Property(
 *             property="revenue_over_time",
 *             type="array",
 *             description="Fourteen daily values; cancelled orders are excluded",
 *
 *             @OA\Items(
 *                 type="object",
 *                 required={"date","label","orders","revenue"},
 *
 *                 @OA\Property(property="date", type="string", format="date", example="2026-08-25"),
 *                 @OA\Property(property="label", type="string", example="25 Aug"),
 *                 @OA\Property(property="orders", type="integer", example=4),
 *                 @OA\Property(property="revenue", type="number", format="float", example=2499.97)
 *             )
 *         )
 *     )
 * )
 */
final class OpenApiSpec {}
