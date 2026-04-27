<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add missing columns to match API controller queries.
     */
    public function up(): void
    {
        // categories: add is_active, order
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('parent_id');
            }
            if (!Schema::hasColumn('categories', 'order')) {
                $table->integer('order')->default(0)->after('is_active');
            }
        });

        // sliders: add order
        Schema::table('sliders', function (Blueprint $table) {
            if (!Schema::hasColumn('sliders', 'order')) {
                $table->integer('order')->default(0)->after('is_active');
            }
        });

        // menus: add is_active
        Schema::table('menus', function (Blueprint $table) {
            if (!Schema::hasColumn('menus', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('location');
            }
        });

        // brands: add is_active
        Schema::table('brands', function (Blueprint $table) {
            if (!Schema::hasColumn('brands', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('url');
            }
        });

        // blog_posts: add published_at
        Schema::table('blog_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('blog_posts', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('is_published');
            }
        });

        // client_reviews: add is_approved (controller uses is_approved, table has is_active)
        Schema::table('client_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('client_reviews', 'is_approved')) {
                $table->boolean('is_approved')->default(true)->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'order']);
        });
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn('order');
        });
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn('published_at');
        });
        Schema::table('client_reviews', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
    }
};
