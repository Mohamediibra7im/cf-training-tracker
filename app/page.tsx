"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart,
  CheckCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";
import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import useHistory from "@/hooks/useHistory";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import { useState } from "react";
import Image from "next/image";
import { AnnouncementCard } from "@/components/AnnouncementCard";

export default function Home() {
  const { user, isLoading: isUserLoading, logout, syncProfile } = useUser();
  const { history, isLoading: isHistoryLoading } = useHistory();
  const { upsolvedProblems, isLoading: isUpsolveLoading } =
    useUpsolvedProblems();
  const { totalSolved } = useHeatmapData(history || [], upsolvedProblems || []);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncProfile();
    setIsSyncing(false);
  };

  if (isUserLoading || isHistoryLoading || isUpsolveLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <section className="container flex flex-col items-center justify-start pt-6 md:pt-14 gap-8 pb-8 px-4 md:px-6">
        {/* Announcement Card */}
        <div className="w-full max-w-2xl">
          <AnnouncementCard className="mb-6" />
        </div>

        <div className="text-center mb-8 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="float">
              <Image
                src="/favicon.ico"
                alt="Training-Tracker"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl gradient-text">
              CF-Training Tracker
            </h1>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Master competitive programming with intelligent practice sessions,
              track your progress, and climb the Codeforces ladder.
            </p>

            {/* Features showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Smart Analytics</h3>
                <p className="text-xs text-muted-foreground">Track your progress with detailed statistics</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Training Sessions</h3>
                <p className="text-xs text-muted-foreground">Personalized practice with difficulty progression</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Sync Progress</h3>
                <p className="text-xs text-muted-foreground">Real-time sync with your Codeforces profile</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Requires a{" "}
                <Link
                  href="https://codeforces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Codeforces account
                </Link>{" "}
                to get started
              </p>
            </div>
          </div>
        </div>        <Settings />
      </section>
    );
  }

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="grid gap-4 sm:gap-6 md:gap-8">
          {/* Welcome Header with Enhanced Design */}
          <div className="flex flex-col items-start gap-3 sm:gap-4 relative px-2 sm:px-0">
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight gradient-text mb-2">
                Welcome back, {user.codeforcesHandle}!
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 font-medium">
                Here&apos;s your programming journey so far
              </p>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {/* Profile Card - Enhanced */}
            <div className="sm:col-span-2 xl:col-span-1 transform hover:scale-[1.02] transition-all duration-300">
              <Profile user={user} />
            </div>

            {/* Total Solved Card - Enhanced */}
            <Card className="card-enhanced group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 relative z-10 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground/90">
                  Total Solved
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center text-center px-3 sm:px-6 py-3 sm:py-4 relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {totalSolved}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground/80 leading-tight font-medium">
                  problems conquered
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-accent/20 rounded-full mt-2 sm:mt-3 opacity-60"></div>
              </CardContent>
            </Card>

            {/* Training Sessions Card - Enhanced */}
            <Card className="card-enhanced group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 relative z-10 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground/90">
                  Training Sessions
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center text-center px-3 sm:px-6 py-3 sm:py-4 relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {history?.length || 0}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground/80 leading-tight font-medium">
                  sessions completed
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-accent/20 via-accent to-primary/20 rounded-full mt-2 sm:mt-3 opacity-60"></div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Heatmap with Enhanced Container */}
          <div className="relative px-2 sm:px-0">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-xl sm:rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 gradient-text">Activity Overview</h2>
              <div className="overflow-x-auto">
                <ActivityHeatmap
                  history={history || []}
                  upsolvedProblems={upsolvedProblems || []}
                />
              </div>
            </div>
          </div>

          {/* Action Cards - Enhanced */}
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Account Actions Card */}
            <Card className="card-enhanced group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 px-3 sm:px-6 py-3 sm:py-6">
                <CardTitle className="text-lg sm:text-xl font-semibold gradient-text flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-base sm:text-xl">Account Management</span>
                </CardTitle>
                <p className="text-muted-foreground text-xs sm:text-sm">Manage your profile and settings</p>
              </CardHeader>
              <CardContent className="relative z-10 px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Sync Profile Button */}
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold rounded-lg btn-enhanced hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/8 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <RefreshCw
                      className={`mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 transition-transform duration-300 ${isSyncing ? "animate-spin" : "group-hover:rotate-180"
                      }`}
                    />
                    <span className="relative z-10">
                      {isSyncing ? "Syncing Profile..." : "Sync Profile"}
                    </span>
                  </Button>

                  {/* Change Password Dialog - Enhanced wrapper */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative">
                      <ChangePasswordDialog />
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={logout}
                    className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold rounded-lg btn-enhanced hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:shadow-lg hover:shadow-red-500/25 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/10 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <LogOut className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="relative z-10">Logout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Training Card - Enhanced */}
            <Card className="card-enhanced group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 px-3 sm:px-6 py-3 sm:py-6">
                <CardTitle className="text-lg sm:text-xl font-semibold gradient-text flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  <span className="text-base sm:text-xl">Ready for a Challenge?</span>
                </CardTitle>
                <p className="text-muted-foreground text-xs sm:text-sm">Start your next coding adventure</p>
              </CardHeader>
              <CardContent className="relative z-10 px-3 sm:px-6 pb-4 sm:pb-6">
                <p className="text-muted-foreground/90 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Create a personalized training session tailored to your skill level and push your limits!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full h-10 sm:h-12 relative overflow-hidden bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl hover:shadow-accent/25 transition-all duration-500 group border-0"
                >
                  <Link href="/training" className="flex items-center justify-center gap-2 sm:gap-3 font-semibold relative z-10 text-xs sm:text-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Start Training</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
