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
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-2xl"></div>
        <div className="relative flex justify-between items-center p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  User Management
                </h2>
                <p className="text-muted-foreground mt-1 text-lg">
                  Manage user roles and permissions across the platform
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center space-y-1">
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-2">
                <User className="h-4 w-4 mr-2" />
                <span className="font-semibold">{users.length}</span>
                <span className="ml-1">total users</span>
              </Badge>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                <span className="font-semibold">{users.filter(u => u.role === 'admin').length}</span>
                <span className="ml-1">admins</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 border-b border-blue-200/30 dark:border-blue-700/30">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Search Users
                </span>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Find users by their Codeforces handle
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                <User className="h-3 w-3 mr-1" />
                Search
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by Codeforces handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md pl-12 h-12 border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
            />
            {searchTerm && (
              <Badge variant="secondary" className="absolute right-3 top-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
                {filteredUsers.length} found
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:via-green-500/20 dark:to-teal-500/20 border-b border-emerald-200/30 dark:border-emerald-700/30">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Users ({filteredUsers.length})
                </span>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage roles and permissions for all platform users
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {searchTerm && (
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                  Filtered results
                </Badge>
              )}
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                <Shield className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-50/80 via-green-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border-b-2 border-emerald-200 dark:border-emerald-700">
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Handle</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Rating</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Rank</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-emerald-700 dark:text-emerald-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
                            <span className="text-gray-500">No handle</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700'
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
                      <Badge variant="outline" className={`${getRankColor(user.rating)} border-current`}>
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
                      <div className="flex gap-2">
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(user._id, 'admin')}
                            disabled={updating === user._id}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 text-green-700 hover:text-green-800 transition-all duration-200"
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
                            className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 text-gray-700 hover:text-gray-800 transition-all duration-200"
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

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-2xl opacity-50"></div>
                <div className="relative p-8">
                  <div className="p-4 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 w-fit mx-auto mb-6 shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </h3>
                  {searchTerm && (
                    <div className="space-y-2">
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search terms or clear the search to see all users.
                      </p>
                      <Badge variant="outline" className="mt-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`rounded-full p-3 ${confirmDialog.newRole === 'admin'
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'
                : 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800'
              }`}>
                {confirmDialog.newRole === 'admin' ? (
                  <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                ) : (
                  <User className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>
            <DialogTitle className={`text-xl font-semibold ${confirmDialog.newRole === 'admin'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400'
            }`}>
              {confirmDialog.newRole === 'admin' ? 'Promote to Admin' : 'Demote to User'}
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {confirmDialog.user?.codeforcesHandle?.slice(0, 2).toUpperCase() || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {confirmDialog.user?.codeforcesHandle || 'Unknown User'}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        Current: {confirmDialog.user?.role}
                      </Badge>
                      <span>→</span>
                      <Badge variant="outline" className="text-xs">
                        New: {confirmDialog.newRole}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${confirmDialog.newRole === 'admin'
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
              }`}>
                <span className="text-xl">
                  {confirmDialog.newRole === 'admin' ? '👑' : '⚠️'}
                </span>
                <span className="text-sm font-medium">
                  {confirmDialog.newRole === 'admin'
                    ? 'This user will gain administrative privileges and access to all admin features.'
                    : 'This user will lose administrative privileges and be restricted to regular user features.'
                  }
                </span>
              </div>

              <p className="text-base font-medium">
                Are you sure you want to {confirmDialog.newRole === 'admin' ? 'promote' : 'demote'} this user?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, user: null, newRole: null })}
              disabled={updating !== null}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRoleChange}
              disabled={updating !== null}
              className={`flex-1 sm:flex-none ${confirmDialog.newRole === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
              }`}
            >
              {updating !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {confirmDialog.newRole === 'admin' ? 'Promoting...' : 'Demoting...'}
                </>
              ) : (
                <>
                  {confirmDialog.newRole === 'admin' ? (
                    <Crown className="mr-2 h-4 w-4" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  {confirmDialog.newRole === 'admin' ? 'Promote User' : 'Demote User'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
