"use client";

import { useState } from "react";
import { Bell, AlertCircle, Megaphone, Sparkles, Settings, RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNotifications, useNotificationCount, markNotificationAsRead, deleteNotification } from "@/hooks/useNotifications";

interface NotificationItemProps {
  notification: {
    _id: string;
    title: string;
    message: string;
    type: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
    priority: "low" | "medium" | "high";
    isRead: boolean;
    createdAt: string;
    expiresAt?: string;
    createdBy: {
      codeforcesHandle: string;
    };
  };
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "new_feature":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case "maintenance":
        return <Settings className="h-4 w-4 text-orange-500" />;
      case "update":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "announcement":
      default:
        return <Megaphone className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id);
        onMarkAsRead(notification._id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteNotification(notification._id);
      onDelete(notification._id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={`mb-3 transition-colors ${notification.isRead ? "opacity-60" : "border-primary/20"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
            {!notification.isRead && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor()} variant="secondary">
              {notification.priority}
            </Badge>
            <div className="flex gap-1">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-7 w-7 p-0"
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                title="Delete notification"
              >
                {isDeleting ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>By {notification.createdBy.codeforcesHandle}</span>
          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
        </div>
        {notification.expiresAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Expires: {new Date(notification.expiresAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, mutate } = useNotifications();
  const { unreadCount, mutate: mutateCount } = useNotificationCount();

  const handleMarkAsRead = (_notificationId: string) => {
    // Optimistically update the UI
    mutate();
    mutateCount();
  };

  const handleDelete = (_notificationId: string) => {
    // Optimistically update the UI
    mutate();
    mutateCount();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with the latest announcements and updates.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: NotificationItemProps["notification"]) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
