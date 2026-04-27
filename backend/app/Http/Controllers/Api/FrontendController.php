<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormNotification;
use App\Models\SiteSetting;
use App\Models\Menu;
use App\Models\Slider;
use App\Models\Category;
use App\Models\Product;
use App\Models\Brand;
use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\ClientReview;
use App\Models\Page;
use App\Models\PaymentMethod;
use App\Models\ShippingZone;

class FrontendController extends Controller
{
    public function settings()
    {
        return response()->json(SiteSetting::pluck('value', 'key'));
    }

    public function menus()
    {
        // Get active menus with their items
        return response()->json(Menu::with(['items' => function($q) {
            $q->orderBy('order');
        }])->where('is_active', true)->get());
    }

    public function sliders()
    {
        return response()->json(Slider::where('is_active', true)->orderBy('order')->get());
    }

    public function categories()
    {
        return response()->json(Category::with('children.children')->whereNull('parent_id')->where('is_active', true)->orderBy('order')->get());
    }

    public function products(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images'])->where('in_stock', true);
        
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('collection')) {
            $collection = $request->collection;
            if ($collection === 'trending') {
                $query->where('is_featured', true);
            } elseif ($collection === 'new_arrivals') {
                $query->where('is_new', true);
            } elseif ($collection === 'daily_offer') {
                $query->whereNotNull('discount_price');
            } elseif ($collection === 'top_sale') {
                $query->orderBy('sold_count', 'desc');
            } elseif ($collection === 'best_deals') {
                $query->whereNotNull('discount_price')->orderByRaw('(price - discount_price) DESC');
            }
        }

        return response()->json($query->paginate(12));
    }

    public function product($slug)
    {
        $product = Product::with(['category', 'brand', 'images', 'variations', 'specifications'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }

    public function brands()
    {
        return response()->json(Brand::where('is_active', true)->get());
    }

    public function blogs()
    {
        return response()->json(BlogPost::with('category')->where('is_published', true)->orderBy('published_at', 'desc')->paginate(9));
    }

    public function faqs()
    {
        return response()->json(Faq::where('is_active', true)->orderBy('order')->get());
    }

    public function reviews()
    {
        return response()->json(ClientReview::where('is_approved', true)->latest()->take(10)->get());
    }

    public function page($slug)
    {
        $page = Page::with(['sections' => function($q) {
            $q->orderBy('order')->where('is_active', true);
        }])->where('slug', $slug)->where('is_published', true)->firstOrFail();

        return response()->json($page);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email',
        ]);

        \App\Models\NewsletterSubscriber::create(['email' => $request->email]);

        return response()->json(['message' => 'Subscribed successfully']);
    }

    public function contact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $submission = \App\Models\ContactSubmission::create($request->only('name', 'email', 'subject', 'message'));

        // Notify admin via email
        try {
            $adminEmail = SiteSetting::where('key', 'site_email')->value('value') ?? config('mail.from.address');
            Mail::to($adminEmail)->send(new ContactFormNotification($submission));
        } catch (\Throwable $e) {
            \Log::warning('Contact notification email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Message sent successfully']);
    }

    public function paymentMethods()
    {
        return response()->json(PaymentMethod::where('is_active', true)->get());
    }

    public function shippingZones()
    {
        return response()->json(ShippingZone::where('is_active', true)->get());
    }
}
