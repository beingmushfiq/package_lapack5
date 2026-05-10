<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SectionVersion extends Model
{
    protected $fillable = [
        'page_section_id',
        'version_number',
        'snapshot',
        'saved_by',
        'change_note',
    ];

    protected $casts = [
        'snapshot' => 'array',
    ];

    public function pageSection(): BelongsTo
    {
        return $this->belongsTo(PageSection::class);
    }
}
