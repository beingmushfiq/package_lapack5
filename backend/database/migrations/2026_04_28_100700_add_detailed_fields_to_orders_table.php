<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Customer Details
            $table->string('customer_name')->after('user_id');
            $table->string('customer_phone')->after('customer_name');
            $table->string('customer_email')->nullable()->after('customer_phone');
            $table->string('district')->nullable()->after('shipping_address');
            $table->string('area')->nullable()->after('district');

            // Financials
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('total_amount');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('shipping_cost');
            $table->decimal('payable_amount', 10, 2)->after('discount_amount');
            $table->string('coupon_code')->nullable()->after('payable_amount');

            // Courier Details
            $table->string('courier_name')->nullable()->after('payment_status');
            $table->string('courier_tracking_id')->nullable()->after('courier_name');
            $table->string('courier_status')->nullable()->after('courier_tracking_id');
            $table->json('courier_response')->nullable()->after('courier_status');

            // Notes
            $table->text('admin_note')->nullable()->after('billing_address');
            $table->text('customer_note')->nullable()->after('admin_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name', 'customer_phone', 'customer_email',
                'district', 'area',
                'shipping_cost', 'discount_amount', 'payable_amount', 'coupon_code',
                'courier_name', 'courier_tracking_id', 'courier_status', 'courier_response',
                'admin_note', 'customer_note'
            ]);
        });
    }
};
