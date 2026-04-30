<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\PromotionalBanner;
use Illuminate\Auth\Access\HandlesAuthorization;

class PromotionalBannerPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:PromotionalBanner');
    }

    public function view(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('View:PromotionalBanner');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:PromotionalBanner');
    }

    public function update(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('Update:PromotionalBanner');
    }

    public function delete(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('Delete:PromotionalBanner');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:PromotionalBanner');
    }

    public function restore(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('Restore:PromotionalBanner');
    }

    public function forceDelete(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('ForceDelete:PromotionalBanner');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:PromotionalBanner');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:PromotionalBanner');
    }

    public function replicate(AuthUser $authUser, PromotionalBanner $promotionalBanner): bool
    {
        return $authUser->can('Replicate:PromotionalBanner');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:PromotionalBanner');
    }

}