"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminNotificationPanel from "@/components/AdminNotificationPanel";
import AdminUserManagement from "@/components/AdminUserManagement";
import useUser from "@/hooks/useUser";
import { useAdminStats } from "@/hooks/useAdminStats";
import Loader from "@/components/Loader";
import {
  Shield,
  Users,
  Bell,
  Settings,
  Crown,
  Activity,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Use the optimized stats hook instead of manual fetching
  const { stats, isLoading: statsLoading, mutate: refreshStats } = useAdminStats();

  useEffect(() => {
    // Add a timeout to prevent infinite loading (3 seconds)
    const timeoutId = setTimeout(() => {
      if (!hasCheckedAuth) {
        setHasCheckedAuth(true);
        // Check localStorage directly as fallback
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.role === "admin") {
              setIsAuthorized(true);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
        // If no valid admin user found, redirect
        router.push("/");
      }
    }, 3000); // 3 second timeout

    // Normal auth check when loading completes
    if (!isLoading) {
      setHasCheckedAuth(true);
      if (!user) {
        clearTimeout(timeoutId);
        router.push("/");
        return;
      }

      if (user.role !== "admin") {
        clearTimeout(timeoutId);
        router.push("/");
        return;
      }

      clearTimeout(timeoutId);
      setIsAuthorized(true);
    }

    return () => clearTimeout(timeoutId);
  }, [user, isLoading, router, hasCheckedAuth]);

  // Refresh stats when tab changes
  useEffect(() => {
    if (isAuthorized) {
      refreshStats();
    }
  }, [activeTab, isAuthorized, refreshStats]);

  // Show loading only if we're still loading and haven't timed out
  if ((isLoading && !hasCheckedAuth) || (!isAuthorized && !hasCheckedAuth)) {
    return <Loader message="Loading Admin Panel..." />;
  }

  // If we've checked auth but user is not admin or doesn't exist, redirect
  if (hasCheckedAuth && (!user || user.role !== "admin")) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-10 max-w-7xl">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl sm:rounded-3xl blur-xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                      Admin Panel
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Manage system notifications, user accounts, and monitor platform activity.
                    <span className="hidden sm:inline"> Full administrative control at your fingertips.</span>
                  </p>
                </div>
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 sm:px-3 py-1 bg-primary/10 border-primary/20 text-primary text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      <span className="hidden xs:inline">Administrator</span>
                      <span className="xs:hidden">Admin</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refreshStats()}
                      disabled={statsLoading}
                      className="flex items-center gap-1 sm:gap-2 text-xs px-2 sm:px-3 py-1 h-7 sm:h-8"
                    >
                      <RefreshCw className={`h-3 w-3 ${statsLoading ? 'animate-spin' : ''}`} />
                      <span className="hidden xs:inline">Refresh</span>
                    </Button>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Welcome, <span className="font-medium text-foreground">{user?.codeforcesHandle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      <span className="hidden sm:inline">Active Notifications</span>
                      <span className="sm:hidden">Active</span>
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.activeNotifications
                      )}
                    </p>
                  </div>
                  <Bell className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      <span className="hidden sm:inline">Total Users</span>
                      <span className="sm:hidden">Users</span>
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.totalUsers
                      )}
                    </p>
                  </div>
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-accent flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      <span className="hidden sm:inline">Admin Users</span>
                      <span className="sm:hidden">Admins</span>
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.adminUsers
                      )}
                    </p>
                  </div>
                  <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-orange-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      <span className="hidden sm:inline">System Status</span>
                      <span className="sm:hidden">Status</span>
                    </p>
                    <p className="text-sm sm:text-lg font-semibold text-green-600">
                      <span className="hidden sm:inline">Operational</span>
                      <span className="sm:hidden">OK</span>
                    </p>
                  </div>
                  <Activity className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs Section */}
          <div className="relative w-full">
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-muted/50 via-transparent to-muted/50 rounded-xl sm:rounded-2xl blur-xl opacity-30" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="hidden sm:block">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold truncate">
                    Management Console
                  </h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshStats()}
                    disabled={statsLoading}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9"
                  >
                    <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden xs:inline sm:inline">Refresh Data</span>
                    <span className="xs:hidden sm:hidden">Refresh Data</span>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11 sm:h-12 lg:h-14 mb-4 sm:mb-6 lg:mb-8 bg-muted/50 p-1 overflow-hidden rounded-lg">
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 rounded-md py-2 px-3"
                  >
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="hidden sm:inline">Notifications</span>
                      <span className="sm:hidden">Alerts</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 rounded-md py-2 px-3"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="hidden sm:inline">User Management</span>
                      <span className="sm:hidden">Users</span>
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="hidden sm:block">
                            <Settings className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                            Notification Management
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-w-2xl">
                          Create, edit, and manage system-wide notifications for users across all platforms and devices.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full overflow-hidden">
                    <AdminNotificationPanel key="notifications" />
                  </div>
                </TabsContent>

                <TabsContent value="users" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      <h2 className="text-xl sm:text-2xl font-semibold">User Management</h2>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Monitor user accounts, manage roles, and view user statistics.
                    </p>
                  </div>
                  <AdminUserManagement key="users" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
