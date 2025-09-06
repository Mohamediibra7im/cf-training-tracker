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
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Notification Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create and manage system notifications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Notification</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[600px] mx-auto sm:w-full max-h-[95vh] overflow-y-auto rounded-xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="space-y-2 sm:space-y-3 pb-4">
                <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <span className="text-base sm:text-xl lg:text-2xl">Create New Notification</span>
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Create a new system notification that will be visible to your selected audience.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:gap-4 lg:gap-6 py-3 sm:py-4 lg:py-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="title" className="text-xs sm:text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title..."
                    className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <MarkdownEditor
                    value={formData.message}
                    onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                    label="Message"
                    placeholder="Enter detailed notification message with Markdown support..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="type" className="text-xs sm:text-sm font-medium">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "announcement" | "new_feature" | "maintenance" | "update" | "alert") =>
                        setFormData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement" className="text-sm">📢 Announcement</SelectItem>
                        <SelectItem value="new_feature" className="text-sm">✨ New Feature</SelectItem>
                        <SelectItem value="maintenance" className="text-sm">🔧 Maintenance</SelectItem>
                        <SelectItem value="update" className="text-sm">🔄 Update</SelectItem>
                        <SelectItem value="alert" className="text-sm">🚨 Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="priority" className="text-xs sm:text-sm font-medium">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low" className="text-sm">🟢 Low</SelectItem>
                        <SelectItem value="medium" className="text-sm">🟡 Medium</SelectItem>
                        <SelectItem value="high" className="text-sm">🔴 High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="targetAudience" className="text-xs sm:text-sm font-medium">Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value: "all" | "admins" | "users") =>
                      setFormData(prev => ({ ...prev, targetAudience: value }))
                    }
                  >
                    <SelectTrigger className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">👥 All Users</SelectItem>
                      <SelectItem value="users" className="text-sm">👤 Users Only</SelectItem>
                      <SelectItem value="admins" className="text-sm">👑 Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="expiresAt" className="text-xs sm:text-sm font-medium">Expires At (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1 text-sm sm:text-base h-9 sm:h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-sm sm:text-base h-9 sm:h-10"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <span>Create Notification</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notifications Table/Cards */}
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Notifications
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage all system notifications and their visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30">
                    <TableHead className="font-semibold text-foreground">Title</TableHead>
                    <TableHead className="font-semibold text-foreground">Type</TableHead>
                    <TableHead className="font-semibold text-foreground">Priority</TableHead>
                    <TableHead className="font-semibold text-foreground">Audience</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Created</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification: NotificationData) => (
                    <TableRow key={notification._id} className="border-border/50 hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={notification.title}>
                          {notification.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(notification.type)} font-medium`} variant="secondary">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(notification.priority)} font-medium`} variant="secondary">
                          {notification.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{notification.targetAudience}</TableCell>
                      <TableCell>
                        <Badge variant={notification.isActive ? "default" : "secondary"} className="font-medium">
                          {notification.isActive ? "🟢 Active" : "🔴 Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(notification._id, notification.isActive, notification.title)}
                            className={`${notification.isActive ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"} transition-colors`}
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
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification._id, notification.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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
          <div className="lg:hidden space-y-4 p-4">
            {notifications.map((notification: NotificationData) => (
              <Card key={notification._id} className="border-border/50 hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-card to-muted/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate" title={notification.title}>
                          {notification.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Created: {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(notification._id, notification.isActive, notification.title)}
                          className={`${notification.isActive ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"} transition-colors p-2`}
                        >
                          {notification.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(notification)}
                          className="text-blue-600 hover:bg-blue-50 transition-colors p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification._id, notification.title)}
                          className="text-red-600 hover:bg-red-50 transition-colors p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getTypeColor(notification.type)} text-xs`} variant="secondary">
                        {notification.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={`${getPriorityColor(notification.priority)} text-xs`} variant="secondary">
                        {notification.priority}
                      </Badge>
                      <Badge variant={notification.isActive ? "default" : "secondary"} className="text-xs">
                        {notification.isActive ? "🟢 Active" : "🔴 Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        👥 {notification.targetAudience}
                      </Badge>
                    </div>

                    {/* Message Preview */}
                    <div className="pt-2 border-t border-border/50">
                      <div className="text-xs sm:text-sm text-muted-foreground line-clamp-3 prose prose-xs max-w-none dark:prose-invert prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {notification.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
