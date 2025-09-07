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

  // Use the optimized stats hook instead of manual fetching
  const { stats, isLoading: statsLoading, mutate: refreshStats } = useAdminStats();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/");
        return;
      }

      if (user.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, isLoading, router]);

  // Refresh stats when tab changes
  useEffect(() => {
    if (isAuthorized) {
      refreshStats();
    }
  }, [activeTab, isAuthorized, refreshStats]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-full blur-xl scale-150" />
          <div className="relative">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Admin Panel
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Manage system notifications, user accounts, and monitor platform activity.
                    Full administrative control at your fingertips.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshStats()}
                    disabled={statsLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-3 w-3 ${statsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Welcome, <span className="font-medium text-foreground">{user?.codeforcesHandle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Notifications</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.activeNotifications
                      )}
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.totalUsers
                      )}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="animate-pulse">—</span>
                      ) : (
                        stats.adminUsers
                      )}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Status</p>
                    <p className="text-lg font-semibold text-green-600">Operational</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs Section */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-muted/50 via-transparent to-muted/50 rounded-2xl blur-xl opacity-30" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-semibold">Management Console</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshStats()}
                  disabled={statsLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh Data</span>
                </Button>
              </div>

              <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 mb-6 sm:mb-8 bg-muted/50 p-1">
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2 text-sm sm:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                    <span className="sm:hidden">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="flex items-center gap-2 text-sm sm:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">User Management</span>
                    <span className="sm:hidden">Users</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="mt-0 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <h2 className="text-xl sm:text-2xl font-semibold">Notification Management</h2>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Create, edit, and manage system-wide notifications for users.
                      </p>
                    </div>
                  </div>
                  <AdminNotificationPanel key="notifications" />
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
