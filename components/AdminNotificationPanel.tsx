"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Management</h1>
          <p className="text-muted-foreground">Create and manage system notifications</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Create a new system notification for users
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Notification message"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
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
                    <Label htmlFor="priority">Priority</Label>
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
                  <Label htmlFor="targetAudience">Target Audience</Label>
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
                  <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Notification"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Manage all system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification: NotificationData) => (
                <TableRow key={notification._id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(notification.type)} variant="secondary">
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                      {notification.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.targetAudience}</TableCell>
                  <TableCell>
                    <Badge variant={notification.isActive ? "default" : "secondary"}>
                      {notification.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(notification._id, notification.isActive, notification.title)}
                        className={notification.isActive ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-700"}
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
                        size="icon"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(notification._id, notification.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                <Label htmlFor="edit-message">Message</Label>
                <Textarea
                  id="edit-message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message"
                  rows={3}
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
