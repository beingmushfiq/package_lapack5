<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CmsApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CmsController extends Controller
{
    public function __construct(private CmsApiService $cms) {}

    /**
     * GET /api/v1/cms/theme
     * Returns global theme tokens as structured JSON.
     */
    public function theme(): JsonResponse
    {
        return response()->json($this->cms->getTheme());
    }

    /**
     * GET /api/v1/cms/navigation
     * Returns primary navigation with mega menu support.
     */
    public function navigation(): JsonResponse
    {
        $location = request('location', 'primary');
        return response()->json([
            'location' => $location,
            'items' => $this->cms->getNavigation($location),
        ]);
    }

    /**
     * GET /api/v1/cms/menus
     * Returns all active menus keyed by location.
     */
    public function menus(): JsonResponse
    {
        return response()->json($this->cms->getAllMenus());
    }

    /**
     * GET /api/v1/cms/footer
     * Returns footer configuration.
     */
    public function footer(): JsonResponse
    {
        return response()->json($this->cms->getFooter());
    }

    /**
     * GET /api/v1/cms/popups
     * Returns active CMS-managed popups.
     */
    public function popups(): JsonResponse
    {
        return response()->json($this->cms->getPopups());
    }

    /**
     * GET /api/v1/cms/announcement-bar
     * Returns active announcement bars.
     */
    public function announcementBars(): JsonResponse
    {
        return response()->json($this->cms->getAnnouncementBars());
    }

    /**
     * GET /api/v1/cms/tracking-scripts
     * Returns active tracking scripts (Pixel, GTM, TikTok, custom).
     */
    public function trackingScripts(): JsonResponse
    {
        return response()->json($this->cms->getTrackingScripts());
    }

    /**
     * POST /api/v1/cms/cache/clear
     * Clears all CMS caches (admin-only).
     */
    public function clearCache(): JsonResponse
    {
        $this->cms->clearCache();
        return response()->json(['message' => 'CMS cache cleared successfully.']);
    }
}
