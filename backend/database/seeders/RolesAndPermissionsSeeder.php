<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $models = [
            'site_settings', 'menus', 'menu_items', 'sliders',
            'categories', 'products', 'brands', 'blog_categories',
            'blog_posts', 'faqs', 'client_reviews', 'promotional_banners',
            'pages', 'page_sections', 'orders', 'payment_methods',
            'shipping_zones', 'coupons', 'newsletter_subscribers',
            'contact_submissions', 'seo_metas', 'tracking_scripts'
        ];

        $actions = ['view', 'view_any', 'create', 'update', 'delete', 'restore', 'force_delete'];

        foreach ($models as $model) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$action}_{$model}"]);
            }
        }

        // Create Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        // Super Admin gets all permissions via a Gate::before rule usually, but we can assign them
        $superAdmin->givePermissionTo(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'Editor']);
        // Editor can manage content but not settings/users
        $editorPermissions = Permission::where('name', 'not like', '%site_settings%')
            ->where('name', 'not like', '%tracking_scripts%')
            ->where('name', 'not like', '%users%')
            ->where('name', 'not like', '%roles%')
            ->get();
        $editor->syncPermissions($editorPermissions);

        $vendor = Role::firstOrCreate(['name' => 'Vendor/Manager']);
        // Vendor can manage products and orders
        $vendorPermissions = Permission::where('name', 'like', '%products%')
            ->orWhere('name', 'like', '%orders%')
            ->orWhere('name', 'like', '%categories%')
            ->get();
        $vendor->syncPermissions($vendorPermissions);

        // Assign to Super Admin User
        $admin = User::where('email', 'admin@gmail.com')->first();
        if ($admin) {
            $admin->assignRole($superAdmin);
        }
    }
}
