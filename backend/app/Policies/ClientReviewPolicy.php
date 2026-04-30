<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\ClientReview;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClientReviewPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:ClientReview');
    }

    public function view(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('View:ClientReview');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:ClientReview');
    }

    public function update(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('Update:ClientReview');
    }

    public function delete(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('Delete:ClientReview');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:ClientReview');
    }

    public function restore(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('Restore:ClientReview');
    }

    public function forceDelete(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('ForceDelete:ClientReview');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:ClientReview');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:ClientReview');
    }

    public function replicate(AuthUser $authUser, ClientReview $clientReview): bool
    {
        return $authUser->can('Replicate:ClientReview');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:ClientReview');
    }

}