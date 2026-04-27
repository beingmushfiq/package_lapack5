<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Panjabi', 'icon' => 'Shirt', 'image' => '/images/products/panjabi.png',
                'subs' => ['Men Panjabi', 'Kids Panjabi', 'Casual Panjabi']
            ],
            [
                'name' => 'Saree', 'icon' => 'Flower', 'image' => '/images/products/saree.png',
                'subs' => ['Jamdani', 'Silk', 'Cotton', 'Designer']
            ],
            [
                'name' => 'Electronics', 'icon' => 'Smartphone', 'image' => '/images/products/smartphone.png',
                'subs' => ['Smartphones', 'Laptops', 'Accessories', 'Home Appliances']
            ],
            [
                'name' => 'Groceries', 'icon' => 'ShoppingBasket', 'image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
                'subs' => ['Cooking', 'Beverages', 'Snacks', 'Breakfast']
            ],
            [
                'name' => 'Beauty', 'icon' => 'Sparkles', 'image' => 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
                'subs' => ['Skincare', 'Makeup', 'Haircare', 'Fragrances']
            ],
            [
                'name' => 'Home', 'icon' => 'Home', 'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
                'subs' => ['Kitchen', 'Decor', 'Furniture', 'Bedding']
            ],
            [
                'name' => 'Shoes', 'icon' => 'Footprints', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
                'subs' => ["Men's Shoes", "Women's Shoes", "Kids' Shoes"]
            ],
            [
                'name' => 'Kids', 'icon' => 'Baby', 'image' => 'https://images.unsplash.com/photo-1519704943920-184478217514?q=80&w=800',
                'subs' => ['Toys', 'Clothing', 'Baby Care']
            ],
            [
                'name' => 'Watches', 'icon' => 'Watch', 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
                'subs' => ['Analog', 'Digital', 'Smart Watches']
            ],
            [
                'name' => 'Bags', 'icon' => 'ShoppingBag', 'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800',
                'subs' => ['Backpacks', 'Handbags', 'Travel Bags']
            ],
            [
                'name' => 'Sports', 'icon' => 'Trophy', 'image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
                'subs' => ['Fitness', 'Outdoor', 'Team Sports']
            ],
            [
                'name' => 'Books', 'icon' => 'Book', 'image' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800',
                'subs' => ['Fiction', 'Academic', 'Kids Books']
            ],
        ];

        $categoryMap = [];
        foreach ($categories as $cat) {
            $parentId = DB::table('categories')->insertGetId([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'icon' => $cat['icon'],
                'image' => $cat['image'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $categoryMap[$cat['name']] = $parentId;

            if (isset($cat['subs'])) {
                foreach ($cat['subs'] as $sub) {
                    $subId = DB::table('categories')->insertGetId([
                        'name' => $sub,
                        'slug' => Str::slug($sub),
                        'parent_id' => $parentId,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $categoryMap[$sub] = $subId;
                }
            }
        }

        $products = [
            [
                'name' => "Nike Air Max 270 React Bauhaus Men's Running Shoes Special Edition",
                'price' => 120, 'original_price' => 160, 'discount' => 25,
                'image' => "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
                'category' => "Men's Shoes", 'rating' => 4.5, 'reviews' => 124, 'is_new' => true, 'sold_count' => "1.2k", 'in_stock' => true
            ],
            [
                'name' => "Jamdani Saree - Traditional Red Silk",
                'price' => 8500, 'original_price' => 12000, 'discount' => 29,
                'image' => "/images/products/saree.png",
                'category' => "Jamdani", 'rating' => 4.9, 'reviews' => 86, 'is_new' => false, 'sold_count' => "450", 'in_stock' => true
            ],
            [
                'name' => "Smartphone X12 - 128GB Midnight Black",
                'price' => 28999, 'original_price' => null, 'discount' => null,
                'image' => "/images/products/smartphone.png",
                'category' => "Smartphones", 'rating' => 4.5, 'reviews' => 210, 'is_new' => true, 'sold_count' => "2.1k", 'in_stock' => true
            ],
            [
                'name' => "Pure Mustard Oil - 5L Premium Quality",
                'price' => 1150, 'original_price' => 1250, 'discount' => 8,
                'image' => "https://images.unsplash.com/photo-1474979266404-7eaacbadcbaf?q=80&w=800",
                'category' => "Cooking", 'rating' => 4.7, 'reviews' => 450, 'is_new' => false, 'sold_count' => "5.4k", 'in_stock' => true
            ],
            [
                'name' => "Leather Formal Shoes - Classic Brown",
                'price' => 3400, 'original_price' => 4500, 'discount' => 24,
                'image' => "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800",
                'category' => "Men's Shoes", 'rating' => 4.6, 'reviews' => 56, 'is_new' => false, 'sold_count' => "120", 'in_stock' => false
            ],
            [
                'name' => "Designer Salwar Kameez - Festive Edition",
                'price' => 4200, 'original_price' => null, 'discount' => null,
                'image' => "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800",
                'category' => "Designer", 'rating' => 4.8, 'reviews' => 32, 'is_new' => true, 'sold_count' => "85", 'in_stock' => true
            ],
            [
                'name' => "Premium Cotton Panjabi - Sky Blue",
                'price' => 2500, 'original_price' => 3200, 'discount' => 22,
                'image' => "/images/products/panjabi.png",
                'category' => "Men Panjabi", 'rating' => 4.7, 'reviews' => 45, 'is_new' => true, 'sold_count' => "310", 'in_stock' => true
            ],
            [
                'name' => "Wireless Earbuds Pro - Noise Cancelling",
                'price' => 4500, 'original_price' => 5500, 'discount' => 18,
                'image' => "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
                'category' => "Accessories", 'rating' => 4.8, 'reviews' => 320, 'is_new' => true, 'sold_count' => "3.2k", 'in_stock' => true
            ],
            [
                'name' => "Luxury Gold Watch - Men's Edition",
                'price' => 12500, 'original_price' => 15000, 'discount' => 17,
                'image' => "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800",
                'category' => "Watches", 'rating' => 4.9, 'reviews' => 45, 'is_new' => false, 'sold_count' => "200", 'in_stock' => true
            ],
            [
                'name' => "Leather Travel Bag - Large Capacity",
                'price' => 5800, 'original_price' => 7200, 'discount' => 19,
                'image' => "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800",
                'category' => "Bags", 'rating' => 4.6, 'reviews' => 88, 'is_new' => false, 'sold_count' => "540", 'in_stock' => true
            ],
            [
                'name' => "Organic Honey - 500g Pure Natural",
                'price' => 650, 'original_price' => 750, 'discount' => 13,
                'image' => "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800",
                'category' => "Groceries", 'rating' => 4.8, 'reviews' => 1200, 'is_new' => false, 'sold_count' => "10k+", 'in_stock' => true
            ],
            [
                'name' => "Running Sneakers - Ultra Lightweight",
                'price' => 3200, 'original_price' => 4000, 'discount' => 20,
                'image' => "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800",
                'category' => "Shoes", 'rating' => 4.5, 'reviews' => 670, 'is_new' => false, 'sold_count' => "4.1k", 'in_stock' => true
            ]
        ];

        foreach ($products as $prod) {
            $productId = DB::table('products')->insertGetId([
                'name' => $prod['name'],
                'slug' => Str::slug($prod['name']),
                'price' => $prod['price'],
                'original_price' => $prod['original_price'],
                'discount' => $prod['discount'],
                'image' => $prod['image'],
                'description' => "<h3>Product Excellence</h3><p>Our <strong>{$prod['name']}</strong> represents the pinnacle of quality and style in the <strong>{$prod['category']}</strong> category. Designed with the modern consumer in mind, it combines premium materials with a sleek aesthetic.</p><p>Key Features:</p><ul><li>Unmatched durability for daily use</li><li>Premium finish and feel</li><li>Eco-friendly manufacturing process</li><li>Available in multiple variations</li></ul>",
                'category_id' => $categoryMap[$prod['category']] ?? null,
                'rating' => $prod['rating'],
                'reviews' => $prod['reviews'],
                'is_new' => $prod['is_new'],
                'sold_count' => $prod['sold_count'],
                'in_stock' => $prod['in_stock'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add standard specifications
            DB::table('product_specifications')->insert([
                ['product_id' => $productId, 'key' => 'Brand', 'value' => 'Premium Brand', 'created_at' => now()],
                ['product_id' => $productId, 'key' => 'Quality', 'value' => 'Certified', 'created_at' => now()],
                ['product_id' => $productId, 'key' => 'Guarantee', 'value' => '100% Genuine', 'created_at' => now()],
                ['product_id' => $productId, 'key' => 'Warranty', 'value' => '6 Months', 'created_at' => now()],
            ]);
        }

        $brands = [
            "Nike", "Adidas", "Samsung", "Apple", "Sony", "Puma", "Gucci", "Prada", "Zara", "H&M", "Levi's", "Rolex"
        ];
        foreach ($brands as $brand) {
            DB::table('brands')->insert([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'logo' => "https://picsum.photos/seed/" . Str::slug($brand) . "/200/200",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $slides = [
            [
                'title' => "Eid Collection 2026", 'subtitle' => "Up to 50% Off on Panjabis & Sarees",
                'image' => "https://picsum.photos/seed/eid/1920/1080", 'button_text' => "Shop Now", 'color' => "bg-emerald-600"
            ],
            [
                'title' => "Smart Living", 'subtitle' => "Latest Electronics at Best Prices",
                'image' => "https://picsum.photos/seed/tech/1920/1080", 'button_text' => "Explore More", 'color' => "bg-blue-600"
            ],
            [
                'title' => "Daily Essentials", 'subtitle' => "Fresh Groceries Delivered to Your Door",
                'image' => "https://picsum.photos/seed/grocery/1920/1080", 'button_text' => "Order Now", 'color' => "bg-orange-600"
            ]
        ];

        foreach ($slides as $slide) {
            DB::table('sliders')->insert(array_merge($slide, ['created_at' => now(), 'updated_at' => now()]));
        }

        $faqs = [
            ['question' => "What are your delivery charges?", 'answer' => "We offer free delivery on orders over $50. For orders below $50, a flat shipping fee of $5 applies nationwide."],
            ['question' => "How long does shipping take?", 'answer' => "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for 1-2 day delivery."],
            ['question' => "What is your return policy?", 'answer' => "We have a 30-day return policy. If you're not satisfied with your purchase, you can return it in its original condition for a full refund or exchange."],
            ['question' => "Do you offer international shipping?", 'answer' => "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."],
            ['question' => "How can I track my order?", 'answer' => "Once your order is shipped, you will receive a tracking number via email. You can use this number on our website to track your package in real-time."]
        ];

        foreach ($faqs as $i => $faq) {
            DB::table('faqs')->insert(array_merge($faq, ['order' => $i, 'created_at' => now(), 'updated_at' => now()]));
        }

        $reviews = [
            ['title' => "Amazing Shopping Experience!", 'youtube_id' => "dQw4w9WgXcQ", 'client_name' => "John Doe", 'rating' => 5],
            ['title' => "Best Quality Products", 'youtube_id' => "jNQXAC9IVRw", 'client_name' => "Jane Smith", 'rating' => 5],
            ['title' => "Fast Delivery and Great Support", 'youtube_id' => "9bZkp7q19f0", 'client_name' => "Robert Wilson", 'rating' => 4],
            ['title' => "Highly Recommended Store", 'youtube_id' => "L_jWHffIx5E", 'client_name' => "Emily Davis", 'rating' => 5]
        ];

        foreach ($reviews as $review) {
            DB::table('client_reviews')->insert(array_merge($review, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Create blog categories and posts
        $blogCatId1 = DB::table('blog_categories')->insertGetId(['name' => 'Fashion', 'slug' => 'fashion', 'created_at' => now(), 'updated_at' => now()]);
        $blogCatId2 = DB::table('blog_categories')->insertGetId(['name' => 'Gadgets', 'slug' => 'gadgets', 'created_at' => now(), 'updated_at' => now()]);
        $blogCatId3 = DB::table('blog_categories')->insertGetId(['name' => 'Lifestyle', 'slug' => 'lifestyle', 'created_at' => now(), 'updated_at' => now()]);

        $blogs = [
            ['title' => "Top 10 Fashion Trends for Eid 2026", 'excerpt' => "Discover the latest styles in Panjabis and Sarees...", 'image' => "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", 'author' => "Sarah Ahmed", 'blog_category_id' => $blogCatId1],
            ['title' => "How to Choose the Perfect Smartphone", 'excerpt' => "With so many options available, finding the right phone can be tough...", 'image' => "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop", 'author' => "Tech Guru", 'blog_category_id' => $blogCatId2],
            ['title' => "5 Healthy Recipes Using Organic Honey", 'excerpt' => "Boost your immunity and satisfy your sweet tooth...", 'image' => "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop", 'author' => "Chef Maria", 'blog_category_id' => $blogCatId3]
        ];

        foreach ($blogs as $blog) {
            DB::table('blog_posts')->insert(array_merge($blog, ['slug' => Str::slug($blog['title']), 'created_at' => now(), 'updated_at' => now()]));
        }

        // Seeding Payment Methods
        $paymentMethods = [
            ['name' => 'Cash on Delivery', 'slug' => 'cod', 'code' => 'cod', 'is_active' => true],
            ['name' => 'bKash', 'slug' => 'bkash', 'code' => 'bkash', 'is_active' => true],
            ['name' => 'Nagad', 'slug' => 'nagad', 'code' => 'nagad', 'is_active' => true],
            ['name' => 'SSL Commerz', 'slug' => 'ssl', 'code' => 'ssl', 'is_active' => true],
        ];

        foreach ($paymentMethods as $pm) {
            DB::table('payment_methods')->insert(array_merge($pm, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Seeding Shipping Zones
        $shippingZones = [
            ['name' => 'Dhaka City', 'cost' => 60, 'is_active' => true],
            ['name' => 'Outside Dhaka', 'cost' => 120, 'is_active' => true],
        ];

        foreach ($shippingZones as $sz) {
            DB::table('shipping_zones')->insert(array_merge($sz, ['created_at' => now(), 'updated_at' => now()]));
        }
    }
}
