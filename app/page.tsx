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
  Settings as SettingsIcon,
  Zap,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";
import Settings from "@/components/Settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-8 sm:space-y-12">
          {/* Unified Welcome & Stats Card */}
          <div className="w-full">
            <Card className="card-premium group relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 flex flex-col">
              {/* Background decorative elements */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full -ml-16 -mb-16 blur-2xl group-hover:bg-accent/20 transition-all duration-500"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl"></div>
              </div>

              {/* Welcome Section */}
              <CardHeader className="relative z-10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                  {/* Left side - Welcome message */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                        <div className="relative w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-primary/80 uppercase tracking-wider">
                        Dashboard
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                        <span className="text-foreground">Welcome back,</span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                          {user.codeforcesHandle}
                        </span>
                        <span className="text-foreground">!</span>
                      </h1>
                    </div>

                    <p className="text-base sm:text-lg text-muted-foreground/80">
                      Here&apos;s your programming journey so far
                    </p>
                  </div>

                  {/* Right side - Profile Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-border">
                      <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
                      <AvatarFallback>
                        {user.codeforcesHandle.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>


                {/* Stats Grid - 4 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {/* Rating */}
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Rating</p>
                    <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                      {user.rating || 0}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.rank || "Unrated"}
                    </p>
                  </div>

                  {/* Max Rating */}
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Max Rating</p>
                    <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                      {user.maxRating || 0}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.maxRank || "Unrated"}
                    </p>
                  </div>

                  {/* Total Solved */}
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">Solved</p>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-1">
                      {totalSolved}
                    </p>
                    <p className="text-xs text-muted-foreground">problems</p>
                  </div>

                  {/* Training Sessions */}
                  <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart className="h-4 w-4 text-accent" />
                      <p className="text-xs font-medium text-muted-foreground">Sessions</p>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent mb-1">
                      {history?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">completed</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6 pb-6">
                {/* Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Problems Solved Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Problems Solved</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">{totalSolved}</p>
                    </div>
                    <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary to-accent/30 rounded-full"></div>
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalSolved / 100) * 100, 100)}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>

                  {/* Training Sessions Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-accent" />
                        <p className="text-sm font-medium text-muted-foreground">Training Sessions</p>
                      </div>
                      <p className="text-sm font-semibold text-accent">{history?.length || 0}</p>
                    </div>
                    <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent to-primary/30 rounded-full"></div>
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((history?.length || 0) / 10) * 100, 100)}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Heatmap - Enhanced */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl blur-2xl"></div>
            <Card className="relative border-2 border-border/50 bg-card/60 backdrop-blur-md shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <div>
                    <CardTitle className="text-2xl font-bold gradient-text">Activity Overview</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Your coding activity throughout the year</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 px-4">
                  <ActivityHeatmap
                    history={history || []}
                    upsolvedProblems={upsolvedProblems || []}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards - Redesigned */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Account Management Card */}
            <Card className="card-premium group relative overflow-hidden border-2 border-border/50 hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <SettingsIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">Account Management</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Manage your profile and settings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full h-12 font-semibold rounded-xl border-2 border-border hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/15 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <RefreshCw
                    className={`mr-2 h-5 w-5 relative z-10 transition-all duration-300 text-foreground group-hover/btn:text-primary ${isSyncing ? "animate-spin" : "group-hover/btn:rotate-180"}`}
                  />
                  <span className="relative z-10 text-foreground group-hover/btn:text-primary">
                    {isSyncing ? "Syncing..." : "Sync Profile"}
                  </span>
                </Button>

                <div className="relative">
                  <ChangePasswordDialog />
                </div>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={logout}
                  className="w-full h-12 font-semibold rounded-xl border-2 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/10 to-red-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <LogOut className="mr-2 h-5 w-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  <span className="relative z-10">Logout</span>
                </Button>
              </CardContent>
            </Card>

            {/* Training Card - Redesigned */}
            <Card className="card-premium group relative overflow-hidden border-2 border-border/50 hover:border-accent/30 transition-all duration-500 bg-gradient-to-br from-accent/5 via-transparent to-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">Ready for a Challenge?</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Start your next coding adventure</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Create a personalized training session tailored to your skill level and push your limits!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full h-14 font-bold text-base rounded-xl bg-gradient-to-r from-accent via-accent/90 to-primary hover:from-accent/90 hover:via-accent/80 hover:to-primary/90 shadow-xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500 group/btn border-0 relative overflow-hidden"
                >
                  <Link href="/training" className="flex items-center justify-center gap-3 relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Start Training</span>
                    <ArrowRight className="h-5 w-5 relative z-10 transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110" />
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
