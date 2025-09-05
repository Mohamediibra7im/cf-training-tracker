"use client";

import { TrainingProblem } from "@/types/TrainingProblem";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import Loader from "@/components/Loader";
import UpsolvedProblemsList from "@/components/UpsolvedProblemsList";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Target,
  CheckCircle2,
  Clock,
  BookOpen,
  Trophy
} from "lucide-react";
import { useMemo, useState } from "react";

export default function UpsolvePage() {
  const {
    upsolvedProblems,
    isLoading,
    error,
    deleteUpsolvedProblem,
    onRefreshUpsolvedProblems,
  } = useUpsolvedProblems();

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<TrainingProblem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!upsolvedProblems || upsolvedProblems.length === 0) {
      return {
        total: 0,
        solved: 0,
        pending: 0,
        solvingRate: 0,
        difficultyDistribution: {}
      };
    }

    const total = upsolvedProblems.length;
    const solved = upsolvedProblems.filter(p => p.solvedTime).length;
    const pending = total - solved;
    const solvingRate = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Difficulty distribution
    const difficultyDistribution = upsolvedProblems.reduce((acc, p) => {
      const rating = p.rating || 0;
      let difficulty = "Unrated";

      if (rating >= 2400) difficulty = "Expert+";
      else if (rating >= 2100) difficulty = "Expert";
      else if (rating >= 1900) difficulty = "Candidate Master";
      else if (rating >= 1600) difficulty = "Specialist";
      else if (rating >= 1400) difficulty = "Pupil";
      else if (rating >= 1200) difficulty = "Newbie";

      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      solved,
      pending,
      solvingRate,
      difficultyDistribution
    };
  }, [upsolvedProblems]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 rounded-full blur-xl scale-150" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 text-center max-w-md">
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                    <Target className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unable to load your upsolve problems. Please try refreshing the page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const onDelete = (problem: TrainingProblem) => {
    setProblemToDelete(problem);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!problemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUpsolvedProblem(problemToDelete);
      setShowConfirmDialog(false);
      setProblemToDelete(null);
    } catch (error) {
      console.error("Failed to delete problem:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isDeleting) {
      setShowConfirmDialog(false);
      setProblemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Upsolve Challenge
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Conquer the problems you couldn&apos;t solve during training sessions.
                    Track your progress and improve your problem-solving skills.
                  </p>
                </div>
                <Button
                  onClick={onRefreshUpsolvedProblems}
                  className="self-start lg:self-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </div>
          </div>

          {upsolvedProblems && upsolvedProblems.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Problems</p>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Solved</p>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.solved}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <Badge variant="outline" className="mt-2 border-green-500/30 text-green-700 dark:text-green-400">
                      {stats.solvingRate}% success rate
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Problems List */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  Problems to Solve
                </h2>
                <UpsolvedProblemsList
                  upsolvedProblems={upsolvedProblems}
                  onDelete={onDelete}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 rounded-full blur-xl scale-150" />
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-12 text-center max-w-md">
                  <div className="space-y-6">
                    <div className="p-6 bg-green-500/10 rounded-full w-fit mx-auto">
                      <Trophy className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                        All Caught Up! 🎉
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Your upsolve list is empty. Excellent work! You&apos;ve solved all the problems
                        from your training sessions or haven&apos;t started any sessions yet.
                      </p>
                    </div>
                    <div className="pt-4">
                      <Badge variant="outline" className="px-4 py-2 text-sm border-green-500/30">
                        Keep up the great work!
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          problem={problemToDelete}
          isLoading={isDeleting}
        />
      </section>
    </div>
  );
}
