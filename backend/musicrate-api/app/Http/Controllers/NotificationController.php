<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        $unreadCount = $user->unreadNotificationsCount();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ], 200);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(string $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notificação não encontrada'
            ], 404);
        }

        // Verify notification belongs to authenticated user
        if ($notification->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Não autorizado'
            ], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notificação marcada como lida'
        ], 200);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->notifications()->unread()->update(['read' => 'Y']);

        return response()->json([
            'message' => 'Todas as notificações foram marcadas como lidas'
        ], 200);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'unread_count' => $user->unreadNotificationsCount()
        ], 200);
    }
}
