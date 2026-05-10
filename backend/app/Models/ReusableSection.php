<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReusableSection extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'thumbnail',
        'components',
        'styles',
        'visibility_rules',
        'animation_config',
        'is_active',
    ];

    protected $casts = [
        'components' => 'array',
        'styles' => 'array',
        'visibility_rules' => 'array',
        'animation_config' => 'array',
        'is_active' => 'boolean',
    ];

    public function pageSections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'reusable_section_id');
    }

    /**
     * Convert to page section config format.
     */
    public function toSectionConfig(): array
    {
        return [
            'type' => $this->type,
            'components' => $this->components ?? [],
            'styles' => $this->styles ?? [],
            'visibility_rules' => $this->visibility_rules ?? [],
            'animation_config' => $this->animation_config ?? [],
        ];
    }
}
