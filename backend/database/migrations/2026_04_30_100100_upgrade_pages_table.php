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
        Schema::table('pages', function (Blueprint $table) {
            // Drop old columns if they exist, then re-add with CMS features
            if (!Schema::hasColumn('pages', 'layout_id')) {
                $table->foreignId('layout_id')->nullable()->constrained('layouts')->nullOnDelete();
            }
            if (!Schema::hasColumn('pages', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('pages', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('pages', 'og_image')) {
                $table->string('og_image')->nullable()->after('meta_description');
            }
            if (!Schema::hasColumn('pages', 'status')) {
                $table->enum('status', ['draft', 'published', 'scheduled'])->default('draft')->after('og_image');
            }
            if (!Schema::hasColumn('pages', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('pages', 'is_homepage')) {
                $table->boolean('is_homepage')->default(false)->after('published_at');
            }
            if (!Schema::hasColumn('pages', 'is_published')) {
                $table->boolean('is_published')->default(false)->after('is_homepage');
            }
            if (!Schema::hasColumn('pages', 'json_ld')) {
                $table->json('json_ld')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['layout_id']);
            $table->dropColumn([
                'layout_id', 'meta_title', 'meta_description', 'og_image',
                'status', 'published_at', 'is_homepage', 'is_published', 'json_ld'
            ]);
        });
    }
};
