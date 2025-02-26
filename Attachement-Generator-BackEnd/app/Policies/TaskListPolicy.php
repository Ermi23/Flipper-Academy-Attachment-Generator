<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TaskList;
use App\Models\TaskListShare;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskListSharePolicy
{
    use HandlesAuthorization;

    // Only allow sharing if the user owns the task list
    public function share(User $user, TaskList $taskList)
    {
        return $user->id === $taskList->user_id; // Only the owner can share the task list
    }

    // Check if the user can view the shared task list
    public function view(User $user, TaskListShare $taskListShare)
    {
        return $user->id === $taskListShare->shared_with_user_id; // User should be the one the list is shared with
    }

    // Check if the user can update the share permission
    public function update(User $user, TaskListShare $taskListShare)
    {
        return $user->id === $taskListShare->shared_with_user_id; // Only the user with the shared permission can update it
    }

    // Check if the user can delete the shared task list entry
    public function delete(User $user, TaskListShare $taskListShare)
    {
        return $user->id === $taskListShare->shared_with_user_id; // Only the user with the shared permission can delete it
    }
}
