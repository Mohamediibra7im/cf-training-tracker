"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminNotifications, createNotification, updateNotification, deleteNotification } from "@/hooks/useAdminNotifications";
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
  targetAudience: "all" | "admins" | "users";
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: {
    codeforcesHandle: string;
  };
}

interface NotificationFormData {
  title: string;
  message: string;
  type: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
  priority: "low" | "medium" | "high";
  targetAudience: "all" | "admins" | "users";
  expiresAt?: string;
}

const initialFormData: NotificationFormData = {
  title: "",
  message: "",
  type: "announcement",
  priority: "medium",
  targetAudience: "all",
  expiresAt: "",
};

export default function AdminNotificationPanel() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingNotification, setDeletingNotification] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { notifications, mutate } = useAdminNotifications();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await updateNotification(editingId, {
          ...formData,
          expiresAt: formData.expiresAt || undefined,
        });
        toast({
          title: "✨ Notification Updated!",
          description: `"${formData.title}" has been successfully updated and is now live.`,
          variant: "success",
          durationMs: 4000
        });
        setIsEditDialogOpen(false);
      } else {
        await createNotification({
          ...formData,
          expiresAt: formData.expiresAt || undefined,
        });
        toast({
          title: "🎉 Notification Created!",
          description: `"${formData.title}" has been published and is now visible to ${formData.targetAudience === 'all' ? 'all users' : formData.targetAudience}.`,
          variant: "success",
          durationMs: 4000
        });
        setIsCreateDialogOpen(false);
      }

      mutate();
      setFormData(initialFormData);
      setEditingId(null);
    } catch (error) {
      toast({
        title: "❌ Operation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
        durationMs: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (notification: NotificationData) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      targetAudience: notification.targetAudience,
      expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().split('T')[0] : "",
    });
    setEditingId(notification._id);
    setIsEditDialogOpen(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean, title: string) => {
    try {
      await updateNotification(id, { isActive: !isActive });
      mutate();
      const action = !isActive ? "activated" : "deactivated";
      const icon = !isActive ? "🟢" : "🔴";
      toast({
        title: `${icon} Notification ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        description: `"${title}" has been ${action} and is ${!isActive ? "now visible to users" : "no longer visible to users"}.`,
        variant: "success",
        durationMs: 4000
      });
    } catch (error) {
      toast({
        title: "❌ Toggle Failed",
        description: error instanceof Error ? error.message : "Failed to update notification status. Please try again.",
        variant: "destructive",
        durationMs: 5000
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    // Open custom confirmation dialog
    setDeletingNotification({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingNotification) return;

    setIsDeleting(true);
    try {
      await deleteNotification(deletingNotification.id);
      mutate();

      // Enhanced success message with icon and better description
      toast({
        title: "🎉 Notification Deleted Successfully!",
        description: `"${deletingNotification.title}" has been permanently removed from the system.`,
        variant: "success",
        durationMs: 4000 // Show longer for better visibility
      });
    } catch (error) {
      // Enhanced error message
      toast({
        title: "❌ Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete notification. Please try again.",
        variant: "destructive",
        durationMs: 5000
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeletingNotification(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingNotification(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "new_feature":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "alert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "announcement":
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full">
      {/* Notifications Table/Cards */}
      <Card className="shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg border border-border/20 w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border/30 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <span className="truncate">All Notifications</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm lg:text-base text-muted-foreground/80 leading-relaxed">
                Manage all system notifications and their visibility
              </CardDescription>
            </div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary font-medium px-2 sm:px-3 py-1 text-xs"
                >
                  {notifications.length} Total
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-700 dark:text-green-400 font-medium px-2 sm:px-3 py-1 text-xs"
                >
                  {notifications.filter((n: NotificationData) => n.isActive).length} Active
                </Badge>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline sm:inline">Create Notification</span>
                    <span className="xs:hidden sm:hidden">Create</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto mx-4">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">Create New Notification</DialogTitle>
                      <DialogDescription className="text-sm sm:text-base">
                        Send a notification to users
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 sm:gap-4 py-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="create-title" className="text-sm">Title</Label>
                        <Input
                          id="create-title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Notification title"
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <MarkdownEditor
                          value={formData.message}
                          onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                          label="Message"
                          placeholder="Notification message with Markdown support..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="create-type" className="text-sm">Type</Label>
                          <Select value={formData.type} onValueChange={(value: "announcement" | "new_feature" | "maintenance" | "update" | "alert") => setFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="announcement">📢 Announcement</SelectItem>
                              <SelectItem value="new_feature">✨ New Feature</SelectItem>
                              <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                              <SelectItem value="update">🔄 Update</SelectItem>
                              <SelectItem value="alert">🚨 Alert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="create-priority" className="text-sm">Priority</Label>
                          <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => setFormData(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="create-targetAudience" className="text-sm">Target Audience</Label>
                        <Select value={formData.targetAudience} onValueChange={(value: "all" | "admins" | "users") => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="users">Users Only</SelectItem>
                            <SelectItem value="admins">Admins Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="create-expiresAt" className="text-sm">Expires At (Optional)</Label>
                        <Input
                          id="create-expiresAt"
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button type="submit" disabled={isLoading} className="text-sm">
                        {isLoading ? "Creating..." : "Create Notification"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {notifications.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-150"></div>
                <div className="relative p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full">
                  <Bell className="h-12 w-12 text-primary/60" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground/80 mb-3">No Notifications Yet</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Create your first notification to start communicating with your users.
                Notifications help keep everyone informed about important updates and announcements.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Notification
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 hover:from-muted/50 hover:via-muted/70 hover:to-muted/50 transition-all duration-300">
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                            Title
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">Type</TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">Priority</TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">Audience</TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">Status</TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide">Created</TableHead>
                        <TableHead className="font-bold text-foreground/90 py-4 px-6 text-sm tracking-wide text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification: NotificationData, index: number) => (
                        <TableRow
                          key={notification._id}
                          className={`border-border/30 hover:bg-gradient-to-r hover:from-primary/5 hover:via-accent/5 hover:to-primary/5 transition-all duration-300 group ${index % 2 === 0 ? 'bg-background/50' : 'bg-muted/20'
                          }`}
                        >
                          <TableCell className="font-semibold max-w-xs py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                              <div className="truncate text-sm" title={notification.title}>
                                {notification.title}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {notification.type === 'new_feature' ? '✨' :
                                  notification.type === 'maintenance' ? '🔧' :
                                    notification.type === 'update' ? '🔄' :
                                      notification.type === 'alert' ? '🚨' : '📢'}
                              </span>
                              <Badge className={`${getTypeColor(notification.type)} font-medium px-3 py-1 text-xs rounded-full shadow-sm border-0`}>
                                {notification.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className={`${getPriorityColor(notification.priority)} font-bold px-3 py-1 text-xs rounded-full shadow-sm border-0 flex items-center gap-1 w-fit`}>
                              <div className={`w-2 h-2 rounded-full ${notification.priority === 'high' ? 'bg-red-500' :
                                notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></div>
                              {notification.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {notification.targetAudience === 'all' ? '👥' :
                                  notification.targetAudience === 'admins' ? '👑' : '👤'}
                              </span>
                              <span className="capitalize text-sm font-medium text-muted-foreground">
                                {notification.targetAudience}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge
                              variant={notification.isActive ? "default" : "secondary"}
                              className={`font-bold px-3 py-1 text-xs rounded-full shadow-sm border-0 ${notification.isActive
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-2 ${notification.isActive ? 'bg-white/90' : 'bg-gray-200'
                              }`}></div>
                              {notification.isActive ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="text-sm text-muted-foreground font-medium">
                              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(notification._id, notification.isActive, notification.title)}
                                className={`${notification.isActive
                                  ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                } transition-all duration-200 hover:scale-105 rounded-lg p-2 shadow-sm hover:shadow-md`}
                                title={`${notification.isActive ? "Deactivate" : "Activate"} "${notification.title}"`}
                              >
                                {notification.isActive ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(notification)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200 hover:scale-105 rounded-lg p-2 shadow-sm hover:shadow-md"
                                title={`Edit "${notification.title}"`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification._id, notification.title)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 hover:scale-105 rounded-lg p-2 shadow-sm hover:shadow-md"
                                title={`Delete "${notification.title}"`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
                {notifications.map((notification: NotificationData) => (
                  <Card
                    key={notification._id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-muted/10 group overflow-hidden relative"
                  >
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-60"></div>

                    <CardContent className="p-4 sm:p-5 lg:p-6 relative z-10">
                      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-primary to-accent rounded-full flex-shrink-0"></div>
                              <h3 className="font-bold text-foreground text-sm sm:text-base lg:text-lg truncate leading-tight" title={notification.title}>
                                {notification.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                <span className="font-medium">
                                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <span className="text-muted-foreground/60">•</span>
                              <span className="text-muted-foreground/80 font-medium truncate">
                                {notification.createdBy.codeforcesHandle}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1 bg-background/50 rounded-lg p-1 backdrop-blur-sm flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(notification._id, notification.isActive, notification.title)}
                              className={`${notification.isActive
                                ? "text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950"
                                : "text-green-600 hover:bg-green-100 dark:hover:bg-green-950"
                              } transition-all duration-200 hover:scale-105 rounded-md p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8`}
                            >
                              {notification.isActive ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(notification)}
                              className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950 transition-all duration-200 hover:scale-105 rounded-md p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification._id, notification.title)}
                              className="text-red-600 hover:bg-red-100 dark:hover:bg-red-950 transition-all duration-200 hover:scale-105 rounded-md p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced Badges */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <Badge className={`${getTypeColor(notification.type)} text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm border-0 flex items-center gap-1 sm:gap-2`}>
                            <span className="text-xs sm:text-sm">
                              {notification.type === 'new_feature' ? '✨' :
                                notification.type === 'maintenance' ? '🔧' :
                                  notification.type === 'update' ? '🔄' :
                                    notification.type === 'alert' ? '🚨' : '📢'}
                            </span>
                            <span className="hidden xs:inline">
                              {notification.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </Badge>
                          <Badge className={`${getPriorityColor(notification.priority)} text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm border-0 flex items-center gap-1 sm:gap-2`}>
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${notification.priority === 'high' ? 'bg-white' :
                              notification.priority === 'medium' ? 'bg-white' : 'bg-white'
                            }`}></div>
                            <span className="hidden xs:inline">
                              {notification.priority.toUpperCase()}
                            </span>
                          </Badge>
                          <Badge
                            className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm border-0 flex items-center gap-1 sm:gap-2 ${notification.isActive
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${notification.isActive ? 'bg-white/90' : 'bg-gray-200'
                            }`}></div>
                            <span className="hidden xs:inline">
                              {notification.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs font-medium px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 flex items-center gap-1 sm:gap-2">
                            <span>
                              {notification.targetAudience === 'all' ? '👥' :
                                notification.targetAudience === 'admins' ? '👑' : '👤'}
                            </span>
                            <span className="hidden xs:inline">
                              {notification.targetAudience.toUpperCase()}
                            </span>
                          </Badge>
                        </div>

                        {/* Enhanced Message Preview */}
                        <div className="relative">
                          <div className="absolute -left-1 sm:-left-2 top-0 w-0.5 sm:w-1 h-full bg-gradient-to-b from-primary/60 to-accent/60 rounded-full"></div>
                          <div className="pl-3 sm:pl-4 py-2 sm:py-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border-l-2 sm:border-l-4 border-gradient-to-b border-primary/30">
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 prose prose-xs max-w-none dark:prose-invert prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 leading-relaxed">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                              >
                                {notification.message}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Notification</DialogTitle>
              <DialogDescription>
                Update the notification details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title"
                  required
                />
              </div>
              <div className="space-y-2">
                <MarkdownEditor
                  value={formData.message}
                  onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                  label="Message"
                  placeholder="Notification message with Markdown support..."
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "announcement" | "new_feature" | "maintenance" | "update" | "alert") =>
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">📢 Announcement</SelectItem>
                      <SelectItem value="new_feature">✨ New Feature</SelectItem>
                      <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                      <SelectItem value="update">🔄 Update</SelectItem>
                      <SelectItem value="alert">🚨 Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-targetAudience">Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value: "all" | "admins" | "users") =>
                    setFormData(prev => ({ ...prev, targetAudience: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="users">Users Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiresAt">Expires At (Optional)</Label>
                <Input
                  id="edit-expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Notification"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
              Delete Notification
            </DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <p className="text-base">
                Are you sure you want to delete
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                &ldquo;{deletingNotification?.title}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">
                  This action cannot be undone and will remove the notification for all users.
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Notification
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
