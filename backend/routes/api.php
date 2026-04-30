<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FrontendController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    
    Route::get('/settings', [FrontendController::class, 'settings']);
    Route::get('/menus', [FrontendController::class, 'menus']);
    Route::get('/sliders', [FrontendController::class, 'sliders']);
    Route::get('/categories', [FrontendController::class, 'categories']);
    Route::get('/products', [FrontendController::class, 'products']);
    Route::get('/products/{slug}', [FrontendController::class, 'product']);
    Route::get('/brands', [FrontendController::class, 'brands']);
    Route::get('/blogs', [FrontendController::class, 'blogs']);
    Route::get('/faqs', [FrontendController::class, 'faqs']);
    Route::get('/reviews', [FrontendController::class, 'reviews']);
    Route::get('/pages/{slug}', [FrontendController::class, 'page']);
    Route::post('/subscribe', [FrontendController::class, 'subscribe']);
    Route::post('/contact', [FrontendController::class, 'contact']);
    Route::get('/track-order', [\App\Http\Controllers\Api\OrderController::class, 'track']);
    Route::get('/payment-methods', [FrontendController::class, 'paymentMethods']);
    Route::get('/shipping-zones', [FrontendController::class, 'shippingZones']);
    Route::get('/promotional-banners', [FrontendController::class, 'promotionalBanners']);
    
    // CMS Page Builder Routes
    Route::prefix('cms')->group(function () {
        Route::get('/homepage', [\App\Http\Controllers\Api\PageBuilderController::class, 'homepage']);
        Route::get('/pages/{slug}', [\App\Http\Controllers\Api\PageBuilderController::class, 'show']);
        Route::get('/layouts', [\App\Http\Controllers\Api\PageBuilderController::class, 'layouts']);
        Route::get('/section-types', [\App\Http\Controllers\Api\PageBuilderController::class, 'sectionTypes']);
    });
    
    // Webhooks
    Route::post('webhooks/courier', [\App\Http\Controllers\Api\WebhookController::class, 'courier']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
        Route::get('/profile', [\App\Http\Controllers\Api\AuthController::class, 'profile']);
        Route::put('/profile', [\App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
        
        Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);
        Route::get('/orders/{order}', [\App\Http\Controllers\Api\OrderController::class, 'show']);
        Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class, 'store']);
    });
});
