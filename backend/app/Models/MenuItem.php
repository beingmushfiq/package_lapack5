<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'menu_id', 'parent_id', 'label', 'url', 'icon', 
        'badge_text', 'badge_color', 'is_mega_menu', 
        'mega_menu_config', 'open_in_new_tab', 
        'description', 'image', 'css_classes', 'order'
    ];

    protected $casts = [
        'mega_menu_config' => 'array',
        'is_mega_menu' => 'boolean',
        'open_in_new_tab' => 'boolean',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }
}
