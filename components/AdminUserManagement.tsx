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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Shield, User as UserIcon, Star, ExternalLink, Loader2, Search, ArrowUpDown, Calendar, BarChart, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useAdminUsers, updateUserRole } from '@/hooks/useAdminUsers';
import { apiFetcher } from '@/lib/apiClient';
import getRankFromRating from '@/utils/getRankFromRating';
import { User } from '@/types/User';

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

interface ConfirmationDialog {
  open: boolean;
  user: User | null;
  newRole: 'admin' | 'user' | null;
}

interface UserStats {
  user: {
    codeforcesHandle: string;
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
  };
  stats: {
    totalSessions: number;
    totalProblems: number;
    solvedProblems: number;
    upsolvedCount: number;
    upsolvedSolvedCount: number;
    averagePerformance: number;
    bestPerformance: number;
    worstPerformance: number;
    solvingRate: number;
    averageRating: number;
    recentTrend: number;
    recentSessions: number;
  };
  trainings: Array<{
    id: string;
    startTime: number;
    endTime: number;
    performance: number;
    problemsCount: number;
    solvedCount: number;
  }>;
}

type SortField = 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';

export default function AdminUserManagement() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    open: false,
    user: null,
    newRole: null
  });
  const [statsDialog, setStatsDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const { toast } = useToast();

  // Use the optimized hook instead of manual fetching
  const { users, isLoading, isError, mutate } = useAdminUsers();

  // Handle error state
  useEffect(() => {
    if (isError) {
      toast({
        title: "❌ Failed to Load Users",
        description: "Unable to fetch user data. Please try refreshing the page.",
        variant: "destructive",
        durationMs: 4000
      });
    }
  }, [isError, toast]);

  useEffect(() => {
    // Filter users based on search term
    let filtered = users.filter((user: User) => {
      const handle = user.codeforcesHandle || '';
      return handle.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort users
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'createdAt') {
        // Validate and parse dates with fallback for invalid/missing dates
        const parseDate = (dateStr: string | undefined): number => {
          if (!dateStr) return 0;
          const parsed = Date.parse(dateStr);
          return isNaN(parsed) ? 0 : parsed;
        };
        const dateA = parseDate(a.createdAt);
        const dateB = parseDate(b.createdAt);
        comparison = dateA - dateB;
      } else if (sortBy === 'name') {
        const nameA = (a.codeforcesHandle || '').toLowerCase();
        const nameB = (b.codeforcesHandle || '').toLowerCase();
        comparison = nameA.localeCompare(nameB);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortBy, sortOrder]);

  const fetchUserStats = async (userId: string) => {
    setLoadingStats(true);
    try {
      const data = await apiFetcher<UserStats>(`/api/admin/users/${userId}/stats`);
      setUserStats(data);
      setStatsDialog({ open: true, userId });
    } catch (_error) {
      toast({
        title: "❌ Failed to Load Statistics",
        description: "Unable to fetch user statistics. Please try again.",
        variant: "destructive",
        durationMs: 4000
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleUserRoleUpdate = async (userId: string, newRole: 'admin' | 'user') => {
    if (updating) return;

    const user = users.find((u: User) => u._id === userId);
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
      await updateUserRole(user._id, newRole);

      // Refresh the data using SWR mutate
      await mutate();

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
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "❌ Role Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update user role. Please try again.',
        variant: "destructive",
        durationMs: 4000
      });
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
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
              <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="font-semibold text-sm sm:text-base">{users.length}</span>
              <span className="ml-1 text-xs sm:text-sm">total users</span>
            </Badge>
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-3 sm:px-4 py-2 rounded-2xl">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="font-semibold text-sm sm:text-base">{users.filter((u: User) => u.role === 'admin').length}</span>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
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
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortField)}>
                <SelectTrigger className="w-[140px] sm:w-[180px] h-10 sm:h-12">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by">
                    {sortBy === 'createdAt' ? 'Created Date' : 'Name'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className="w-[140px] sm:w-[160px] h-10 sm:h-12">
                  <SelectValue placeholder="Order">
                    {sortOrder === 'desc'
                      ? (sortBy === 'createdAt' ? 'Newest First' : 'Z → A')
                      : (sortBy === 'createdAt' ? 'Oldest First' : 'A → Z')
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    {sortBy === 'createdAt' ? 'Newest First' : 'Z → A'}
                  </SelectItem>
                  <SelectItem value="asc">
                    {sortBy === 'createdAt' ? 'Oldest First' : 'A → Z'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block w-full">
            <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm w-full">
              <Table className="w-full min-w-[800px]">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <TableHead className="h-14 px-3 xl:px-4 font-bold text-foreground/90 text-xs xl:text-sm whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-xl bg-primary/10">
                          <UserIcon className="h-3 w-3 xl:h-4 xl:w-4 text-primary" />
                        </div>
                        <span>User</span>
                      </div>
                    </TableHead>
                    <TableHead className="h-14 px-3 xl:px-4 font-bold text-foreground/90 text-xs xl:text-sm whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-xl bg-purple-500/10">
                          <Crown className="h-3 w-3 xl:h-4 xl:w-4 text-purple-600" />
                        </div>
                        <span>Role</span>
                      </div>
                    </TableHead>
                    <TableHead className="h-14 px-3 xl:px-4 font-bold text-foreground/90 text-xs xl:text-sm whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-xl bg-yellow-500/10">
                          <Star className="h-3 w-3 xl:h-4 xl:w-4 text-yellow-600" />
                        </div>
                        <span>Rating</span>
                      </div>
                    </TableHead>
                    <TableHead className="h-14 px-3 xl:px-4 font-bold text-foreground/90 text-xs xl:text-sm whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-xl bg-emerald-500/10">
                          <Calendar className="h-3 w-3 xl:h-4 xl:w-4 text-emerald-600" />
                        </div>
                        <span>Created</span>
                      </div>
                    </TableHead>
                    <TableHead className="h-14 px-3 xl:px-4 font-bold text-foreground/90 text-xs xl:text-sm text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="p-1 rounded-xl bg-blue-500/10">
                          <Shield className="h-3 w-3 xl:h-4 xl:w-4 text-blue-600" />
                        </div>
                        <span>Actions</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/30">
                  {filteredUsers.map((user, index) => (
                    <TableRow
                      key={user._id}
                      className={`group hover:bg-gradient-to-r hover:from-muted/30 hover:via-muted/20 hover:to-muted/30 transition-all duration-300 border-border/20 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      }`}
                    >
                      <TableCell className="px-3 xl:px-4 py-4">
                        <div className="flex items-center space-x-2 xl:space-x-3">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-10 w-10 xl:h-12 xl:w-12 rounded-xl xl:rounded-2xl ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20">
                              <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs xl:text-sm font-bold rounded-xl xl:rounded-2xl">
                                {user.codeforcesHandle?.slice(0, 2).toUpperCase() || 'UN'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 xl:w-4 xl:h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                              <div className="w-1.5 h-1.5 xl:w-2 xl:h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            {user.codeforcesHandle ? (
                              <div className="space-y-0.5">
                                <a
                                  href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 xl:space-x-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold text-sm xl:text-base group-hover:text-blue-700"
                                >
                                  <span className="truncate max-w-[120px] xl:max-w-none">{user.codeforcesHandle}</span>
                                  <ExternalLink className="h-3 w-3 xl:h-4 xl:w-4 flex-shrink-0 opacity-70" />
                                </a>
                                <p className="text-xs text-muted-foreground font-medium truncate">
                                  {user._id.slice(-8)}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="text-muted-foreground font-medium text-sm">No handle</span>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user._id.slice(-8)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 xl:px-4 py-4">
                        <div className="flex items-center">
                          <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={`${user.role === 'admin'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200 shadow-lg shadow-gray-500/10'
                            } font-bold px-2 xl:px-3 py-1 xl:py-1.5 rounded-xl xl:rounded-2xl transition-all duration-300 group-hover:scale-105 text-xs xl:text-sm`}
                          >
                            {user.role === 'admin' ? (
                              <Crown className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-1.5" />
                            ) : (
                              <UserIcon className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-1.5" />
                            )}
                            <span className="uppercase tracking-wide">
                              {user.role}
                            </span>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 xl:px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-1.5 xl:space-x-2">
                            <div className="p-0.5 xl:p-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg xl:rounded-xl">
                              <Star className="h-3 w-3 xl:h-4 xl:w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <span className="font-bold text-base xl:text-lg text-foreground">
                              {user.rating || 'Unrated'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`${getRankColor(user.rating)} border-current font-bold px-2 xl:px-3 py-0.5 xl:py-1 rounded-xl xl:rounded-2xl bg-background/50 backdrop-blur-sm text-xs`}
                            >
                              <Shield className="h-2.5 w-2.5 xl:h-3 xl:w-3 mr-1" />
                              {getRankFromRating(user.rating)}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 xl:px-4 py-4">
                        <div className="flex flex-col space-y-0.5">
                          <div className="flex items-center space-x-1.5 xl:space-x-2">
                            <Calendar className="h-3 w-3 xl:h-4 xl:w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <span className="font-medium text-xs xl:text-sm text-foreground whitespace-nowrap">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground pl-4 xl:pl-6">
                            {user.createdAt ? new Date(user.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 xl:px-4 py-4">
                        <div className="flex items-center justify-center gap-1.5 xl:gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchUserStats(user._id)}
                            disabled={loadingStats}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all rounded-xl xl:rounded-2xl font-semibold px-2 xl:px-3 py-1.5 xl:py-2 shadow-sm hover:shadow-md disabled:opacity-50 text-xs xl:text-sm"
                            title="View Statistics"
                          >
                            {loadingStats && statsDialog.userId === user._id ? (
                              <>
                                <Loader2 className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2 animate-spin" />
                                <span className="hidden xl:inline">Loading...</span>
                              </>
                            ) : (
                              <>
                                <BarChart className="h-3 w-3 xl:h-4 xl:w-4 xl:mr-2" />
                                <span className="hidden xl:inline">Stats</span>
                              </>
                            )}
                          </Button>
                          {user.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserRoleUpdate(user._id, 'admin')}
                              disabled={updating === user._id}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 text-green-700 hover:text-green-800 transition-all rounded-xl xl:rounded-2xl font-semibold px-2 xl:px-3 py-1.5 xl:py-2 shadow-sm hover:shadow-md disabled:opacity-50 text-xs xl:text-sm"
                              title="Promote to Admin"
                            >
                              {updating === user._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2 animate-spin" />
                                  <span className="hidden xl:inline">Promoting...</span>
                                </>
                              ) : (
                                <>
                                  <Crown className="h-3 w-3 xl:h-4 xl:w-4 xl:mr-2" />
                                  <span className="hidden xl:inline">Promote</span>
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserRoleUpdate(user._id, 'user')}
                              disabled={updating === user._id}
                              className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 text-gray-700 hover:text-gray-800 transition-all rounded-xl xl:rounded-2xl font-semibold px-2 xl:px-3 py-1.5 xl:py-2 shadow-sm hover:shadow-md disabled:opacity-50 text-xs xl:text-sm"
                              title="Demote to User"
                            >
                              {updating === user._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2 animate-spin" />
                                  <span className="hidden xl:inline">Demoting...</span>
                                </>
                              ) : (
                                <>
                                  <UserIcon className="h-3 w-3 xl:h-4 xl:w-4 xl:mr-2" />
                                  <span className="hidden xl:inline">Demote</span>
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
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex-shrink-0">
                          <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
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
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 transition-colors text-base sm:text-lg font-semibold"
                            >
                              <span className="break-words">{user.codeforcesHandle}</span>
                              <ExternalLink className="h-4 w-4 flex-shrink-0" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-base sm:text-lg font-medium">No handle</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchUserStats(user._id)}
                          disabled={loadingStats}
                          className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all text-xs sm:text-sm rounded-xl"
                        >
                          {loadingStats && statsDialog.userId === user._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <BarChart className="h-3 w-3 mr-1" />
                              <span>Stats</span>
                            </>
                          )}
                        </Button>
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserRoleUpdate(user._id, 'admin')}
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
                            onClick={() => handleUserRoleUpdate(user._id, 'user')}
                            disabled={updating === user._id}
                            className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-800 transition-all text-xs sm:text-sm rounded-xl"
                          >
                            {updating === user._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <UserIcon className="h-3 w-3 mr-1" />
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
                          <UserIcon className="h-3 w-3 mr-1" />
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

                    {/* Created At */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-border/30">
                      <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs text-muted-foreground">
                        Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/20 rounded-2xl opacity-50"></div>
                <div className="relative p-6 sm:p-8">
                  <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/30 w-fit mx-auto mb-4 sm:mb-6">
                    <UserIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
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
                  <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
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
                    <AvatarImage src={confirmDialog.user?.avatar} alt={confirmDialog.user?.codeforcesHandle} />
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
                    <UserIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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

      {/* User Statistics Dialog */}
      <Dialog open={statsDialog.open} onOpenChange={(open) => !open && setStatsDialog({ open: false, userId: null })}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart className="h-6 w-6 text-primary" />
              User Statistics
            </DialogTitle>
            {userStats && (
              <DialogDescription className="text-base">
                Detailed statistics for <span className="font-semibold text-foreground">{userStats.user.codeforcesHandle}</span>
              </DialogDescription>
            )}
          </DialogHeader>

          {userStats ? (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Rating</p>
                      <p className="text-2xl font-bold text-primary">{userStats.user.rating || 0}</p>
                      <p className="text-xs text-muted-foreground capitalize">{userStats.user.rank || 'Unrated'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Rating</p>
                      <p className="text-2xl font-bold text-primary">{userStats.user.maxRating || 0}</p>
                      <p className="text-xs text-muted-foreground capitalize">{userStats.user.maxRank || 'Unrated'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold text-accent">{userStats.stats.totalSessions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Sessions</p>
                      <p className="text-2xl font-bold text-accent">{userStats.stats.recentSessions}</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Training Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Training Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Problems Solved</p>
                      </div>
                      <p className="text-3xl font-bold text-primary">{userStats.stats.solvedProblems}</p>
                      <p className="text-xs text-muted-foreground mt-1">out of {userStats.stats.totalProblems}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-accent" />
                        <p className="text-sm font-medium text-muted-foreground">Upsolved</p>
                      </div>
                      <p className="text-3xl font-bold text-accent">{userStats.stats.upsolvedSolvedCount}</p>
                      <p className="text-xs text-muted-foreground mt-1">out of {userStats.stats.upsolvedCount}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Solving Rate</p>
                      </div>
                      <p className="text-3xl font-bold text-primary">{userStats.stats.solvingRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Average Performance</p>
                      <p className="text-2xl font-bold text-primary">{userStats.stats.averagePerformance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Best Performance</p>
                      <p className="text-2xl font-bold text-green-600">{userStats.stats.bestPerformance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Worst Performance</p>
                      <p className="text-2xl font-bold text-red-600">{userStats.stats.worstPerformance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Recent Trend</p>
                      <p className={`text-2xl font-bold ${userStats.stats.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {userStats.stats.recentTrend >= 0 ? '+' : ''}{userStats.stats.recentTrend}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Training Sessions */}
              {userStats.trainings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Training Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userStats.trainings.map((training) => (
                        <div key={training.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(training.startTime).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {training.solvedCount} / {training.problemsCount} problems solved
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">Performance: {training.performance}</p>
                            <p className="text-xs text-muted-foreground">
                              Duration: {Math.round((training.endTime - training.startTime) / 60000)} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setStatsDialog({ open: false, userId: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}