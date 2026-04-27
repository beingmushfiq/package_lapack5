const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'backend', 'database', 'migrations');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.php'));

const schemas = {
  'site_settings': `$table->string('key')->unique();
            $table->text('value')->nullable();`,
  'menus': `$table->string('name');
            $table->string('location')->nullable();`,
  'menu_items': `$table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('url')->nullable();
            $table->string('target')->default('_self');
            $table->integer('order')->default(0);`,
  'sliders': `$table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('image');
            $table->string('button_text')->nullable();
            $table->string('color')->nullable();
            $table->boolean('is_active')->default(true);`,
  'categories': `$table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();`,
  'products': `$table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('discount', 5, 2)->nullable();
            $table->string('image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews')->default(0);
            $table->boolean('is_new')->default(false);
            $table->string('sold_count')->default('0');
            $table->boolean('in_stock')->default(true);`,
  'product_images': `$table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->integer('order')->default(0);`,
  'product_variations': `$table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('value');
            $table->decimal('additional_price', 10, 2)->default(0);`,
  'product_specifications': `$table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('key');
            $table->string('value');`,
  'brands': `$table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('url')->nullable();`,
  'blog_categories': `$table->string('name');
            $table->string('slug')->unique();`,
  'blog_posts': `$table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->string('author')->nullable();
            $table->foreignId('blog_category_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_published')->default(true);`,
  'faqs': `$table->string('question');
            $table->text('answer');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);`,
  'client_reviews': `$table->string('title');
            $table->string('client_name');
            $table->integer('rating')->default(5);
            $table->string('youtube_id')->nullable();
            $table->text('review_text')->nullable();
            $table->boolean('is_active')->default(true);`,
  'promotional_banners': `$table->string('title')->nullable();
            $table->string('image');
            $table->string('link')->nullable();
            $table->boolean('is_active')->default(true);`,
  'pages': `$table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->boolean('is_active')->default(true);`,
  'page_sections': `$table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->integer('order')->default(0);`,
  'orders': `$table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending');
            $table->text('shipping_address')->nullable();
            $table->text('billing_address')->nullable();`,
  'order_items': `$table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);`,
  'payment_methods': `$table->string('name');
            $table->boolean('is_active')->default(true);`,
  'shipping_zones': `$table->string('name');
            $table->decimal('cost', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);`,
  'coupons': `$table->string('code')->unique();
            $table->string('type');
            $table->decimal('value', 10, 2);
            $table->decimal('min_order_amount', 10, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);`,
  'newsletter_subscribers': `$table->string('email')->unique();
            $table->boolean('is_active')->default(true);`,
  'contact_submissions': `$table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);`,
  'seo_metas': `$table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();`,
  'tracking_scripts': `$table->string('name');
            $table->text('script_code');
            $table->string('position')->default('head');
            $table->boolean('is_active')->default(true);`
};

for (const file of files) {
  for (const [tableName, schema] of Object.entries(schemas)) {
    if (file.includes(`create_${tableName}_table`)) {
      let content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      // Simple string replacement if the schema hasn't been injected yet
      if (!content.includes(schema.trim().split('\\n')[0])) {
          content = content.replace(
              /(\\$table->id\\(\\);\\s*)(\\$table->timestamps\\(\\);)/,
              "$1" + schema + "\\n            $2"
          );
          fs.writeFileSync(path.join(migrationsDir, file), content);
          console.log(`Updated ${file}`);
      } else {
          console.log(`Skipped ${file} (already updated)`);
      }
    }
  }
}
