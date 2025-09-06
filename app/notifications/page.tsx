"use client";

import { useState } from "react";
import { Bell, AlertCircle, Megaphone, Sparkles, Settings, RefreshCw, Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNotifications, markNotificationAsRead, deleteNotification } from "@/hooks/useNotifications";
import { useToast } from "@/components/Toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface NotificationData {
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
}

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "new_feature":
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      case "maintenance":
        return <Settings className="h-5 w-5 text-orange-500" />;
      case "update":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "announcement":
      default:
        return <Megaphone className="h-5 w-5 text-green-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleMarkAsRead = async () => {
    if (notification.isRead) return;

    setIsMarkingAsRead(true);
    try {
      await onMarkAsRead(notification._id);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(notification._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${!notification.isRead
      ? "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/30"
      : ""
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <CardTitle className="text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {notification.title}
                </CardTitle>
                {!notification.isRead && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor()} font-medium px-3 py-1 text-xs`}
                >
                  {notification.priority.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/80 dark:bg-gray-700/80 font-medium px-3 py-1 text-xs shadow-sm"
                >
                  {notification.type.replace("_", " ").toUpperCase()}
                </Badge>
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>•</span>
                  <span>{new Date(notification.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}</span>
                  <span>•</span>
                  <span>By {notification.createdBy.codeforcesHandle}</span>
                </div>
              </div>

              <div className="flex sm:hidden items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>{new Date(notification.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}</span>
                <span>•</span>
                <span>By {notification.createdBy.codeforcesHandle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                disabled={isMarkingAsRead}
                className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all duration-200 hover:scale-110"
                title="Mark as read"
              >
                {isMarkingAsRead ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 hover:scale-110"
              title="Delete notification"
            >
              {isDeleting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-p:my-3 prose-headings:my-4 prose-ul:my-3 prose-ol:my-3 prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {notification.message}
          </ReactMarkdown>
        </div>

        {notification.expiresAt && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">
                Expires: {new Date(notification.expiresAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { notifications, mutate } = useNotifications();
  const { toast } = useToast();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      mutate();
      toast({
        title: "✅ Marked as Read",
        description: "Notification has been marked as read.",
        variant: "success",
      });
    } catch (_error) {
      toast({
        title: "❌ Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      mutate();
      toast({
        title: "🗑️ Deleted",
        description: "Notification has been deleted.",
        variant: "success",
      });
    } catch (_error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = filteredNotifications.filter((n: NotificationData) => !n.isRead);
      await Promise.all(unreadNotifications.map((n: NotificationData) => markNotificationAsRead(n._id)));
      mutate();
      toast({
        title: "✅ All Marked as Read",
        description: `Marked ${unreadNotifications.length} notifications as read.`,
        variant: "success",
      });
    } catch (_error) {
      toast({
        title: "❌ Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  // Filter notifications
  const filteredNotifications = notifications?.filter((notification: NotificationData) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesTab = activeTab === "all" ||
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead);

    return matchesSearch && matchesType && matchesPriority && matchesTab;
  }) || [];

  const unreadCount = notifications?.filter((n: NotificationData) => !n.isRead).length || 0;
  const readCount = notifications?.filter((n: NotificationData) => n.isRead).length || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg">
            <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Notifications
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest announcements, features, and important updates
          </p>
        </div>

        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <Button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border shadow-lg rounded-xl p-1">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
                <span className="sm:hidden">All</span>
                <Badge variant="secondary" className="ml-1">
                  {notifications?.length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="flex items-center gap-2 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Unread</span>
                <span className="sm:hidden">New</span>
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="flex items-center gap-2 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
              >
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Read</span>
                <span className="sm:hidden">Read</span>
                <Badge variant="secondary" className="ml-1">
                  {readCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="announcement">🔔 Announcement</SelectItem>
                      <SelectItem value="new_feature">✨ New Feature</SelectItem>
                      <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                      <SelectItem value="update">🔄 Update</SelectItem>
                      <SelectItem value="alert">⚠️ Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">🔴 High Priority</SelectItem>
                      <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                      <SelectItem value="low">🟢 Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-muted-foreground mb-3">
                  No notifications found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md leading-relaxed">
                  {searchQuery || typeFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your filters to see more notifications."
                    : "You're all caught up! No notifications to display."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: NotificationData) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
