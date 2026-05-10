<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('section_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_section_id')->constrained('page_sections')->cascadeOnDelete();
            $table->integer('version_number');
            $table->json('snapshot'); // full section snapshot at save time
            $table->string('saved_by')->nullable(); // user email or name
            $table->text('change_note')->nullable();
            $table->timestamps();

            $table->index(['page_section_id', 'version_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('section_versions');
    }
};
