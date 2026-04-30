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
        Schema::table('page_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('page_sections', 'type')) {
                $table->string('type')->default('rich_text')->after('title');
            }
            if (!Schema::hasColumn('page_sections', 'components')) {
                $table->json('components')->nullable()->after('content');
            }
            if (!Schema::hasColumn('page_sections', 'styles')) {
                $table->json('styles')->nullable()->after('components');
            }
            if (!Schema::hasColumn('page_sections', 'visibility_rules')) {
                $table->json('visibility_rules')->nullable()->after('styles');
            }
            if (!Schema::hasColumn('page_sections', 'api_source')) {
                $table->json('api_source')->nullable()->after('visibility_rules');
            }
            if (!Schema::hasColumn('page_sections', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('api_source');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_sections', function (Blueprint $table) {
            $table->dropColumn([
                'type', 'components', 'styles', 'visibility_rules', 'api_source', 'is_active'
            ]);
        });
    }
};
