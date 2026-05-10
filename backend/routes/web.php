<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/orders/{order}/invoice', [\App\Http\Controllers\Api\OrderController::class, 'downloadInvoice'])
    ->name('orders.invoice')
    ->middleware(['auth']);

// Payment Simulation Routes
Route::get('/payment/sandbox', [\App\Http\Controllers\Api\PaymentController::class, 'sandboxPage'])->name('payment.sandbox');
Route::post('/payment/callback', [\App\Http\Controllers\Api\PaymentController::class, 'callback'])->name('payment.callback');
