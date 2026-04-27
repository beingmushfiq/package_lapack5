<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class TrackingSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'fb_pixel_id' => '',
            'fb_pixel_enabled' => 'false',
            'fb_test_event_code' => '',
            'fb_capi_access_token' => '',
            'fb_capi_enabled' => 'false',
            'gtm_id' => '',
            'gtm_enabled' => 'false',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
