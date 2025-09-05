"use client";

import useHistory from "@/hooks/useHistory";
import useUser from "@/hooks/useUser";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import Loader from "@/components/Loader";
import History from "@/components/History";
import ProgressChart from "@/components/ProgressChart";
import UpsolveReminder from "@/components/UpsolveReminder";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  BarChart3,
  Trophy,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useMemo } from "react";

export default function StatisticsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { history, isLoading, deleteTraining, isDeleting } = useHistory();
  const { upsolvedProblems } = useUpsolvedProblems();

  // Calculate statistics
  const stats = useMemo(() => {
    if (!history || history.length === 0) return null;

    const totalSessions = history.length;
    const totalProblems = history.reduce((acc, session) => acc + session.problems.length, 0);
    const solvedProblems = history.reduce((acc, session) =>
      acc + session.problems.filter(p => p.solvedTime).length, 0
    );
    const upsolvedCount = upsolvedProblems?.length || 0;

    const averagePerformance = Math.round(
      history.reduce((acc, session) => acc + session.performance, 0) / totalSessions
    );

    const bestPerformance = Math.max(...history.map(session => session.performance));

    const recentTrend = history.length >= 2 ?
      history[history.length - 1].performance - history[history.length - 2].performance : 0;

    const averageRating = Math.round(
      history.reduce((acc, session) => {
        const sessionRatings = Object.values(session.customRatings);
        const sessionAvg = sessionRatings.reduce((sum, rating) => sum + rating, 0) / sessionRatings.length;
        return acc + sessionAvg;
      }, 0) / totalSessions
    );

    const solvingRate = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    return {
      totalSessions,
      totalProblems,
      solvedProblems,
      upsolvedCount,
      averagePerformance,
      bestPerformance,
      recentTrend,
      averageRating,
      solvingRate
    };
  }, [history, upsolvedProblems]);

  if (isLoading || isUserLoading) {
    return <Loader />;
  }

  // Wait for user data to be loaded from localStorage
  if (!user) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          <UpsolveReminder />

          {/* Header Section with enhanced styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Your Statistics
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                  Comprehensive insights into your competitive programming journey. Track your progress,
                  analyze performance trends, and celebrate your achievements.
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {history && history.length > 0 && stats ? (
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Sessions
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stats.totalSessions}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Training sessions
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Performance
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stats.averagePerformance}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={stats.recentTrend >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {stats.recentTrend >= 0 ? "+" : ""}{stats.recentTrend} recent
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Best Performance
                      </CardTitle>
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stats.bestPerformance}
                    </div>
                    <Badge variant="outline" className="mt-2 border-yellow-500/30">
                      Personal record
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Solving Rate
                      </CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stats.solvingRate}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {stats.solvedProblems}/{stats.totalProblems} problems
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-gradient-to-r from-card to-muted/10 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground">{stats.averageRating}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-card to-muted/10 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground">{stats.solvedProblems}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-card to-muted/10 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <CardTitle className="text-sm font-medium">Upsolved</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground">{stats.upsolvedCount}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Heatmap */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  Activity Overview
                </h2>
                <ActivityHeatmap history={history} upsolvedProblems={upsolvedProblems} />
              </div>

              {/* Performance Chart */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-3">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  Performance Trends
                </h2>
                <ProgressChart history={history} />
              </div>

              {/* Training History */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-3">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  Training History
                </h2>
                <History
                  history={history}
                  deleteTraining={(trainingId: string) =>
                    deleteTraining(trainingId)
                  }
                  isDeleting={isDeleting}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-full blur-xl scale-150" />
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-12 text-center max-w-md">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      No training data yet
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Start your competitive programming journey! Complete your first training
                      session to unlock detailed statistics and progress tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
