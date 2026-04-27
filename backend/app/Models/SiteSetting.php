<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        // Handle boolean-like values
        if ($setting->value === 'true' || $setting->value === '1') return true;
        if ($setting->value === 'false' || $setting->value === '0') return false;

        return $setting->value;
    }
}
