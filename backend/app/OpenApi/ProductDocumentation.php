<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/products",
 *     operationId="listProducts",
 *     tags={"Products"},
 *     summary="List products",
 *     description="Returns a public paginated product catalogue with search, price, stock, and sorting options.",
 *
 *     @OA\Parameter(name="search", in="query", required=false, description="Search product names and descriptions", @OA\Schema(type="string", maxLength=255, example="scooter")),
 *     @OA\Parameter(name="min_price", in="query", required=false, @OA\Schema(type="number", format="float", minimum=0, example=500)),
 *     @OA\Parameter(name="max_price", in="query", required=false, description="Must be greater than or equal to min_price", @OA\Schema(type="number", format="float", minimum=0, example=1500)),
 *     @OA\Parameter(name="in_stock", in="query", required=false, description="True returns available products; false returns products with zero stock", @OA\Schema(type="boolean", example=true)),
 *     @OA\Parameter(name="sort_by", in="query", required=false, @OA\Schema(type="string", enum={"name","price","stock_quantity","created_at","updated_at"}, default="created_at")),
 *     @OA\Parameter(name="sort_direction", in="query", required=false, @OA\Schema(type="string", enum={"asc","desc"}, default="desc")),
 *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, maximum=50, default=10)),
 *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1, default=1)),
 *
 *     @OA\Response(response=200, description="Paginated products", @OA\JsonContent(ref="#/components/schemas/ProductListResponse")),
 *     @OA\Response(response=422, description="Invalid filters", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Post(
 *     path="/products",
 *     operationId="createProduct",
 *     tags={"Products"},
 *     summary="Create a product",
 *     description="Administrator only. The optional product image is stored on the public local disk.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\RequestBody(
 *         required=true,
 *
 *         @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(ref="#/components/schemas/ProductCreateRequest"))
 *     ),
 *
 *     @OA\Response(response=201, description="Product created", @OA\JsonContent(ref="#/components/schemas/ProductMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Get(
 *     path="/products/{product}",
 *     operationId="showProduct",
 *     tags={"Products"},
 *     summary="Get a product",
 *
 *     @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\Response(response=200, description="Product details", @OA\JsonContent(ref="#/components/schemas/ProductResourceResponse")),
 *     @OA\Response(response=404, description="Product not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 *
 * @OA\Put(
 *     path="/products/{product}",
 *     operationId="replaceProduct",
 *     tags={"Products"},
 *     summary="Update a product using PUT",
 *     description="Administrator only. All submitted fields are validated; fields may be updated partially. For reliable PHP multipart uploads, clients may send POST with a form field named _method set to PUT.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\RequestBody(
 *         required=true,
 *
 *         @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(ref="#/components/schemas/ProductUpdateRequest")),
 *         @OA\MediaType(mediaType="application/json", @OA\Schema(ref="#/components/schemas/ProductUpdateRequest"))
 *     ),
 *
 *     @OA\Response(response=200, description="Product updated", @OA\JsonContent(ref="#/components/schemas/ProductMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Product not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Patch(
 *     path="/products/{product}",
 *     operationId="updateProduct",
 *     tags={"Products"},
 *     summary="Update a product using PATCH",
 *     description="Administrator only. For reliable PHP multipart uploads, clients may send POST with a form field named _method set to PATCH, as the frontend does.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\RequestBody(
 *         required=true,
 *
 *         @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(ref="#/components/schemas/ProductUpdateRequest")),
 *         @OA\MediaType(mediaType="application/json", @OA\Schema(ref="#/components/schemas/ProductUpdateRequest"))
 *     ),
 *
 *     @OA\Response(response=200, description="Product updated", @OA\JsonContent(ref="#/components/schemas/ProductMutationResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Product not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Delete(
 *     path="/products/{product}",
 *     operationId="deleteProduct",
 *     tags={"Products"},
 *     summary="Delete a product",
 *     description="Administrator only. A product referenced by any order item cannot be deleted.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer", minimum=1, example=1)),
 *
 *     @OA\Response(response=200, description="Product deleted", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=403, description="Administrator access required", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=404, description="Product not found", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=409, description="Product has existing orders", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 */
final class ProductDocumentation {}
