'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Shield, User, Calendar, Star, ExternalLink, Loader2, Search } from 'lucide-react';
import { useToast } from '@/components/Toast';
import getRankFromRating from '@/utils/getRankFromRating';

const getRankColor = (rating: number): string => {
  if (rating === 0) return 'text-gray-500';
  if (rating < 1200) return 'text-gray-600';
  if (rating < 1400) return 'text-green-600';
  if (rating < 1600) return 'text-cyan-600';
  if (rating < 1900) return 'text-blue-600';
  if (rating < 2100) return 'text-purple-600';
  if (rating < 2300) return 'text-yellow-600';
  if (rating < 2400) return 'text-orange-600';
  if (rating < 2600) return 'text-red-600';
  if (rating < 3000) return 'text-red-700';
  return 'text-red-800';
};

interface User {
  _id: string;
  codeforcesHandle: string;
  role: 'admin' | 'user';
  rating: number;
  rank: string;
  createdAt: string;
}

interface ConfirmationDialog {
  open: boolean;
  user: User | null;
  newRole: 'admin' | 'user' | null;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    open: false,
    user: null,
    newRole: null
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsersOnMount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else if (response.status === 403) {
          toast({
            title: "🚫 Access Denied",
            description: "Admin access required to view user management.",
            variant: "destructive",
            durationMs: 4000
          });
        } else {
          console.error('Failed to fetch users');
          toast({
            title: "❌ Failed to Load Users",
            description: "Unable to fetch user data. Please try refreshing the page.",
            variant: "destructive",
            durationMs: 4000
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "❌ Failed to Load Users",
          description: "An unexpected error occurred while loading user data.",
          variant: "destructive",
          durationMs: 4000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsersOnMount();
  }, [toast]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user => {
      const handle = user.codeforcesHandle || '';
      return handle.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (updating) return;

    const user = users.find(u => u._id === userId);
    if (!user) return;

    // Open confirmation dialog instead of using browser confirm
    setConfirmDialog({
      open: true,
      user,
      newRole
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!confirmDialog.user || !confirmDialog.newRole) return;

    const { user, newRole } = confirmDialog;
    setUpdating(user._id);
    setConfirmDialog({ open: false, user: null, newRole: null });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id, role: newRole }),
      });

      if (response.ok) {
        // Update the user in the local state
        setUsers(prev => prev.map(u =>
          u._id === user._id ? { ...u, role: newRole } : u
        ));

        // Beautiful success toast
        const isPromotion = newRole === 'admin';
        toast({
          title: isPromotion ? "🎉 User Promoted Successfully!" : "✅ User Role Updated!",
          description: isPromotion
            ? `${user.codeforcesHandle} is now an administrator with full access to admin features.`
            : `${user.codeforcesHandle} has been demoted to a regular user account.`,
          variant: "success",
          durationMs: 5000
        });
      } else {
        const error = await response.json();
        toast({
          title: "❌ Role Update Failed",
          description: error.error || 'Failed to update user role. Please try again.',
          variant: "destructive",
          durationMs: 4000
        });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "🔧 Connection Error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
        durationMs: 4000
      });
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-2xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  User Management
                </h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base lg:text-lg">
                  Manage user roles and permissions across the platform
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-row sm:flex-row lg:flex-col xl:flex-row items-center gap-3 sm:gap-4">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-2xl">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="font-semibold text-sm sm:text-base">{users.length}</span>
              <span className="ml-1 text-xs sm:text-sm">total users</span>
            </Badge>
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-3 sm:px-4 py-2 rounded-2xl">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="font-semibold text-sm sm:text-base">{users.filter(u => u.role === 'admin').length}</span>
              <span className="ml-1 text-xs sm:text-sm">admins</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-xl">
              <Search className="h-4 w-5 sm:h-5 sm:w-5 text-primary" />
            </div>
            Search Users
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find users by their Codeforces handle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search by Codeforces handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 bg-background border-2 focus:ring-2 transition-all duration-200"
            />
            {searchTerm && (
              <Badge variant="secondary" className="absolute right-3 top-2 sm:top-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl">
                {filteredUsers.length} found
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span>Users ({filteredUsers.length})</span>
            </div>
            {searchTerm && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                Filtered results
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage roles and permissions for all platform users
          </p>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30">
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Handle</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4" />
                        <span>Role</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span>Rating</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Rank</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="border-border/50 hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 rounded-2xl">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-2xl">
                              {user.codeforcesHandle?.slice(0, 2).toUpperCase() || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {user.codeforcesHandle ? (
                              <a
                                href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 transition-colors"
                              >
                                <span>{user.codeforcesHandle}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No handle</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-2xl'
                            : 'bg-muted text-muted-foreground font-medium rounded-2xl'
                          }
                        >
                          {user.role === 'admin' ? (
                            <Crown className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{user.rating || 'Unrated'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getRankColor(user.rating)} border-current font-medium rounded-2xl`}>
                          {getRankFromRating(user.rating)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {user.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user._id, 'admin')}
                              disabled={updating === user._id}
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-all rounded-xl"
                            >
                              {updating === user._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Crown className="h-3 w-3 mr-1" />
                                  Make Admin
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user._id, 'user')}
                              disabled={updating === user._id}
                              className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-800 transition-all rounded-xl"
                            >
                              {updating === user._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <User className="h-3 w-3 mr-1" />
                                  Make User
                                </>
                              )}
                            </Button>
                          )}
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
            {filteredUsers.map((user) => (
              <Card key={user._id} className="border-border/50 hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-card to-muted/10 rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-2xl">
                            {user.codeforcesHandle?.slice(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          {user.codeforcesHandle ? (
                            <a
                              href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 transition-colors text-sm sm:text-base font-medium"
                            >
                              <span className="truncate">{user.codeforcesHandle}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm sm:text-base">No handle</span>
                          )}
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Joined: {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Role Action Button */}
                      <div className="flex-shrink-0">
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(user._id, 'admin')}
                            disabled={updating === user._id}
                            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-all text-xs sm:text-sm rounded-xl"
                          >
                            {updating === user._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Crown className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Make Admin</span>
                                <span className="sm:hidden">Admin</span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(user._id, 'user')}
                            disabled={updating === user._id}
                            className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-800 transition-all text-xs sm:text-sm rounded-xl"
                          >
                            {updating === user._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <User className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Make User</span>
                                <span className="sm:hidden">User</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-2xl'
                          : 'bg-muted text-muted-foreground text-xs rounded-2xl'
                        }
                      >
                        {user.role === 'admin' ? (
                          <Crown className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {user.role}
                      </Badge>

                      <Badge variant="outline" className="text-xs rounded-2xl">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {user.rating || 'Unrated'}
                      </Badge>

                      <Badge variant="outline" className={`${getRankColor(user.rating)} border-current text-xs rounded-2xl`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRankFromRating(user.rating)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/20 rounded-2xl opacity-50"></div>
                <div className="relative p-6 sm:p-8">
                  <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/30 w-fit mx-auto mb-4 sm:mb-6">
                    <User className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </h3>
                  {searchTerm && (
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Try adjusting your search terms or clear the search to see all users.
                      </p>
                      <Badge variant="outline" className="mt-2 sm:mt-3 bg-muted/50 text-muted-foreground text-xs sm:text-sm">
                        Searched for: &ldquo;{searchTerm}&rdquo;
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Beautiful Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, user: null, newRole: null })}>
        <DialogContent className="w-[95vw] max-w-md mx-auto sm:w-full rounded-xl">
          <DialogHeader className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className={`rounded-full p-2 sm:p-3 ${confirmDialog.newRole === 'admin'
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'
                : 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800'
              }`}>
                {confirmDialog.newRole === 'admin' ? (
                  <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                ) : (
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>
            <DialogTitle className={`text-lg sm:text-xl font-semibold ${confirmDialog.newRole === 'admin'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400'
            }`}>
              {confirmDialog.newRole === 'admin' ? 'Promote to Admin' : 'Demote to User'}
            </DialogTitle>
            <DialogDescription className="text-center space-y-3 sm:space-y-4">
              <div className="bg-muted/50 rounded-2xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm rounded-2xl">
                      {confirmDialog.user?.codeforcesHandle?.slice(0, 2).toUpperCase() || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {confirmDialog.user?.codeforcesHandle || 'Unknown User'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs rounded-2xl">
                        Current: {confirmDialog.user?.role}
                      </Badge>
                      <span className="hidden sm:inline">→</span>
                      <span className="sm:hidden">↓</span>
                      <Badge variant="outline" className="text-xs rounded-2xl">
                        New: {confirmDialog.newRole}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-2xl ${confirmDialog.newRole === 'admin'
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
              }`}>
                <span className="text-lg sm:text-xl">
                  {confirmDialog.newRole === 'admin' ? '👑' : '⚠️'}
                </span>
                <span className="text-xs sm:text-sm font-medium text-center">
                  {confirmDialog.newRole === 'admin'
                    ? 'This user will gain administrative privileges and access to all admin features.'
                    : 'This user will lose administrative privileges and be restricted to regular user features.'
                  }
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium">
                Are you sure you want to {confirmDialog.newRole === 'admin' ? 'promote' : 'demote'} this user?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, user: null, newRole: null })}
              disabled={updating !== null}
              className="w-full sm:w-auto order-2 sm:order-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRoleChange}
              disabled={updating !== null}
              className={`w-full sm:w-auto order-1 sm:order-2 rounded-xl ${confirmDialog.newRole === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
              }`}
            >
              {updating !== null ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="text-sm sm:text-base">
                    {confirmDialog.newRole === 'admin' ? 'Promoting...' : 'Demoting...'}
                  </span>
                </>
              ) : (
                <>
                  {confirmDialog.newRole === 'admin' ? (
                    <Crown className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="text-sm sm:text-base">
                    {confirmDialog.newRole === 'admin' ? 'Promote User' : 'Demote User'}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
