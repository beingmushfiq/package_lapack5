<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_popups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->string('trigger')->default('delay'); // delay, exit_intent, scroll, page_load
            $table->integer('trigger_delay')->default(3); // seconds for delay trigger
            $table->integer('trigger_scroll')->default(50); // % scroll for scroll trigger
            $table->json('show_on_pages')->nullable(); // array of page slugs, null = all pages
            $table->json('visibility_rules')->nullable(); // auth/device rules
            $table->integer('show_after_visits')->default(0); // 0 = always, N = after N visits
            $table->boolean('is_dismissible')->default(true);
            $table->string('position')->default('center'); // center, bottom-left, bottom-right, top
            $table->string('size')->default('md'); // sm, md, lg, xl, full
            $table->json('styles')->nullable(); // custom styles
            $table->timestamp('schedule_start')->nullable();
            $table->timestamp('schedule_end')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('cms_announcement_bars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('content'); // HTML/text content
            $table->string('background_color')->default('#10b981');
            $table->string('text_color')->default('#ffffff');
            $table->string('link_url')->nullable();
            $table->string('link_text')->nullable();
            $table->boolean('is_dismissible')->default(true);
            $table->string('position')->default('top'); // top, bottom
            $table->json('visibility_rules')->nullable();
            $table->timestamp('schedule_start')->nullable();
            $table->timestamp('schedule_end')->nullable();
            $table->boolean('is_active')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_popups');
        Schema::dropIfExists('cms_announcement_bars');
    }
};
