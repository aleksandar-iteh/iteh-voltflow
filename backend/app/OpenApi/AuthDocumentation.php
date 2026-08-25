<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/register",
 *     operationId="registerUser",
 *     tags={"Authentication"},
 *     summary="Register a regular user",
 *     description="Creates an account with the user role and immediately issues a Laravel Sanctum token. The role field is prohibited.",
 *
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/RegisterRequest")),
 *
 *     @OA\Response(response=201, description="User registered", @OA\JsonContent(ref="#/components/schemas/AuthResponse")),
 *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Post(
 *     path="/login",
 *     operationId="loginUser",
 *     tags={"Authentication"},
 *     summary="Log in",
 *     description="Authenticates a user or administrator and issues a new Laravel Sanctum token.",
 *
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/LoginRequest")),
 *
 *     @OA\Response(response=200, description="Authenticated", @OA\JsonContent(ref="#/components/schemas/AuthResponse")),
 *     @OA\Response(response=401, description="Incorrect credentials", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
 * )
 *
 * @OA\Get(
 *     path="/user",
 *     operationId="getAuthenticatedUser",
 *     tags={"Authentication"},
 *     summary="Get the authenticated user",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Response(response=200, description="Authenticated user", @OA\JsonContent(ref="#/components/schemas/UserResourceResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 *
 * @OA\Post(
 *     path="/logout",
 *     operationId="logoutUser",
 *     tags={"Authentication"},
 *     summary="Log out",
 *     description="Revokes the Laravel Sanctum token used for the current request.",
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Response(response=200, description="Logged out", @OA\JsonContent(ref="#/components/schemas/MessageResponse")),
 *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/MessageResponse"))
 * )
 */
final class AuthDocumentation {}
