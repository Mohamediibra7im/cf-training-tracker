import Link from "next/link";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Training } from "@/types/Training";
import CountDown from "@/components/CountDown";
import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Lock, CheckCircle2, XCircle, Loader2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { SubmissionStatus } from "@/utils/codeforces/getTrainingSubmissionStatus";

const ProblemRow = ({
  problem,
  index,
  isTraining,
  startTime,
  submissionStatus,
}: {
  problem: TrainingProblem;
  index: number;
  isTraining: boolean;
  startTime: number | null;
  submissionStatus?: SubmissionStatus;
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isTraining || !startTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTraining, startTime]);

  const isPreContestPeriod = isTraining && startTime && currentTime < startTime;
  const problemLabels = ["A", "B", "C", "D"];

  const getSolvedStatus = () => {
    if (!isTraining) return "";

    // Show submission status if available
    if (submissionStatus) {
      switch (submissionStatus.status) {
        case "AC":
          if (problem.solvedTime && startTime) {
            const solvedMinutes = Math.floor(
              (problem.solvedTime - startTime) / 60000,
            );
            return (
              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>{solvedMinutes}m</span>
              </span>
            );
          }
          return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />;
        case "WA":
          return <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />;
        case "TESTING":
          return <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-500" />;
        default:
          break;
      }
    }

    // Fallback to original logic
    if (problem.solvedTime && startTime) {
      const solvedMinutes = Math.floor(
        (problem.solvedTime - startTime) / 60000,
      );
      return (
        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <span>{solvedMinutes}m</span>
        </span>
      );
    }
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  };

  // Get overlay class based on submission status
  const getOverlayClass = () => {
    if (!isTraining || !submissionStatus) return "";

    switch (submissionStatus.status) {
      case "AC":
        return "bg-green-500/20 border-green-500/30";
      case "WA":
        return "bg-red-500/20 border-red-500/30";
      case "TESTING":
        return "bg-blue-500/20 border-blue-500/30 animate-pulse";
      default:
        return "";
    }
  };

  const overlayClass = getOverlayClass();

  const content = (
    <div
      className={`group relative overflow-hidden rounded-lg sm:rounded-xl border transition-all duration-300 ${isPreContestPeriod
        ? "bg-muted/50 cursor-not-allowed opacity-70 border-muted"
        : overlayClass || "bg-card/80 hover:bg-card border-border/50 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]"
      }`}
    >
      {/* Gradient overlay on hover */}
      {!isPreContestPeriod && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}

      {/* Mobile Layout (xs to sm) */}
      <div className="block md:hidden relative p-2 xs:p-3 sm:p-4">
        <div className="flex items-start gap-2 xs:gap-2 sm:gap-3">
          <div className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center font-bold text-xs xs:text-xs sm:text-sm flex-shrink-0 transition-colors duration-300 ${isPreContestPeriod
            ? "bg-muted text-muted-foreground"
            : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
          }`}>
            {problemLabels[index]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground text-sm xs:text-base sm:text-lg mb-1 xs:mb-1 sm:mb-1 leading-tight break-words">
              {problem.name}
            </div>
            <div className="flex items-center justify-between gap-1 xs:gap-2 sm:gap-2">
              <div className="text-muted-foreground text-xs xs:text-xs sm:text-sm">
                {problem.contestId}-{problem.index}
              </div>
              <div className="flex items-center gap-1 xs:gap-1 sm:gap-2 flex-shrink-0">
                {isTraining && (
                  <div className="text-xs xs:text-xs sm:text-sm font-medium">
                    {getSolvedStatus()}
                  </div>
                )}
                {isPreContestPeriod && (
                  <Lock className="h-3 w-3 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout (md to lg) */}
      <div className="hidden md:block lg:hidden relative p-3 xs:p-4 sm:p-4">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-3">
          <div className={`w-8 h-8 xs:w-9 xs:h-9 rounded-lg flex items-center justify-center font-bold text-sm xs:text-base transition-colors duration-300 ${isPreContestPeriod
            ? "bg-muted text-muted-foreground"
            : "bg-gradient-to-br from-primary to-accent text-primary-foreground group-hover:shadow-lg"
          }`}>
            {problemLabels[index]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground text-base xs:text-lg mb-1 group-hover:text-primary transition-colors duration-300 break-words">
              {problem.name}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-muted-foreground text-xs xs:text-sm">
                Contest {problem.contestId} • Problem {problem.index}
              </div>
              <div className="flex items-center gap-2 xs:gap-3 shrink-0">
                {isTraining && (
                  <div className="text-sm xs:text-base font-medium">
                    {getSolvedStatus()}
                  </div>
                )}
                {isPreContestPeriod && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg+) */}
      <div className="hidden lg:block relative p-4 lg:p-5 xl:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-5 flex-1">
            <div className="flex items-center gap-3 lg:gap-3 xl:gap-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg xl:rounded-xl flex items-center justify-center font-bold text-lg lg:text-xl xl:text-2xl transition-colors duration-300 ${isPreContestPeriod
                ? "bg-muted text-muted-foreground"
                : "bg-gradient-to-br from-primary to-accent text-primary-foreground group-hover:shadow-lg"
              }`}>
                {problemLabels[index]}
              </div>
              {isPreContestPeriod && (
                <Lock className="h-5 w-5 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-lg lg:text-xl xl:text-2xl mb-1 group-hover:text-primary transition-colors duration-300 break-words">
                {problem.name}
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-muted-foreground text-sm lg:text-base flex-wrap">
                <span>Contest {problem.contestId}</span>
                <span>•</span>
                <span>Problem {problem.index}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {isTraining && (
              <div className="text-base lg:text-lg xl:text-xl font-medium min-w-[100px] lg:min-w-[120px] xl:min-w-[140px] text-right">
                {getSolvedStatus()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isPreContestPeriod) {
    return content;
  }

  return (
    <Link href={problem.url} target="_blank" className="block no-underline">
      {content}
    </Link>
  );
};

const Trainer = ({
  isTraining,
  training,
  problems,
  generateProblems,
  startTraining,
  stopTraining,
  refreshProblemStatus,
  finishTraining,
  selectedTags,
  lb,
  ub,
  customRatings,
  submissionStatuses,
  isRefreshing,
}: {
  isTraining: boolean;
  training: Training | null;
  problems: TrainingProblem[] | null;
  generateProblems: (
    tags: ProblemTag[],
    lb: number,
    ub: number,
    customRatings: { P1: number; P2: number; P3: number; P4: number },
  ) => void;
  startTraining: (customRatings: {
    P1: number;
    P2: number;
    P3: number;
    P4: number;
  }) => void;
  stopTraining: () => void;
  refreshProblemStatus: () => void;
  finishTraining: () => void;
  selectedTags: ProblemTag[];
  lb: number;
  ub: number;
  customRatings: { P1: number; P2: number; P3: number; P4: number };
  submissionStatuses: SubmissionStatus[];
  isRefreshing: boolean;
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isTraining || !training?.startTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTraining, training?.startTime]);

  const isPreContestPeriod =
    isTraining && training?.startTime && currentTime < training.startTime;

  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const onFinishTraining = () => setIsFinishDialogOpen(true);
  const confirmFinish = () => {
    setIsFinishDialogOpen(false);
    finishTraining();
  };
  const cancelFinish = () => setIsFinishDialogOpen(false);

  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const onStopTraining = () => setIsStopDialogOpen(true);
  const confirmStop = () => {
    setIsStopDialogOpen(false);
    stopTraining();
  };
  const cancelStop = () => setIsStopDialogOpen(false);

  const currentProblems =
    isTraining && training?.problems ? training.problems : problems;

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-muted/30 w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
      <CardContent className="relative pt-6 xs:pt-7 sm:pt-8 space-y-6 xs:space-y-7 sm:space-y-8 px-3 xs:px-4 sm:px-6">
        {isStopDialogOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-title"
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={cancelStop} />
            <div className="relative z-10 w-full max-w-sm xs:max-w-md">
              <div className="rounded-xl xs:rounded-2xl border-2 border-red-500/40 bg-background/95 backdrop-blur-xl shadow-2xl">
                <div className="p-4 xs:p-5 sm:p-6 space-y-4 xs:space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle className="h-5 w-5 xs:h-6 xs:w-6 text-red-500" />
                    </div>
                    <h3 id="stop-title" className="text-lg xs:text-xl font-semibold">Stop training?</h3>
                  </div>
                  <p className="text-sm xs:text-base text-muted-foreground">
                    This will end your current session without saving it. Are you sure you want to stop?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:justify-end pt-1 xs:pt-2">
                    <Button variant="outline" onClick={cancelStop} className="flex-1 sm:flex-none h-9 xs:h-10">Cancel</Button>
                    <Button variant="destructive" onClick={confirmStop} className="flex-1 sm:flex-none h-9 xs:h-10">Stop Training</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isFinishDialogOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="finish-title"
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={cancelFinish} />
            <div className="relative z-10 w-full max-w-sm xs:max-w-md">
              <div className="rounded-xl xs:rounded-2xl border-2 border-yellow-500/40 bg-background/95 backdrop-blur-xl shadow-2xl">
                <div className="p-4 xs:p-5 sm:p-6 space-y-4 xs:space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 xs:h-6 xs:w-6 text-yellow-500" />
                    </div>
                    <h3 id="finish-title" className="text-lg xs:text-xl font-semibold">Finish training?</h3>
                  </div>
                  <p className="text-sm xs:text-base text-muted-foreground">
                    We will save your session, add unsolved problems to upsolve reminders, and take you to your statistics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:justify-end pt-1 xs:pt-2">
                    <Button variant="outline" onClick={cancelFinish} className="flex-1 sm:flex-none h-9 xs:h-10">Cancel</Button>
                    <Button onClick={confirmFinish} className="bg-yellow-600 hover:bg-yellow-600/90 text-white flex-1 sm:flex-none h-9 xs:h-10">Finish Training</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Section */}
        {currentProblems && currentProblems.length > 0 && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="flex items-center gap-2 xs:gap-2 sm:gap-3">
              <div className="w-0.5 xs:w-0.5 sm:w-1 h-5 xs:h-6 sm:h-8 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0"></div>
              <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Problems
              </h3>
              <div className="px-2 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-muted rounded-full text-xs xs:text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                {currentProblems.length} problem{currentProblems.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid gap-2 xs:gap-3 sm:gap-4 lg:gap-5">
              {currentProblems.map((problem, index) => {
                const problemId = `${problem.contestId}_${problem.index}`;
                const submissionStatus = submissionStatuses.find(
                  (status) => status.problemId === problemId,
                );

                return (
                  <ProblemRow
                    key={`${problem.contestId}-${problem.index}-${index}`}
                    problem={problem}
                    index={index}
                    isTraining={isTraining}
                    startTime={training?.startTime ?? null}
                    submissionStatus={submissionStatus}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="flex flex-col items-center gap-4 xs:gap-5 sm:gap-6">
          {!isTraining ? (
            <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md">
              <div className="flex flex-col xs:flex-col sm:flex-row justify-center gap-3 xs:gap-3 sm:gap-4">
                <Button
                  onClick={() =>
                    generateProblems(selectedTags, lb, ub, customRatings)
                  }
                  size="lg"
                  className="flex-1 h-10 xs:h-11 sm:h-12 text-sm xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {problems && problems.length > 0
                    ? "🔄 Regenerate Problems"
                    : "✨ Generate Problems"}
                </Button>
                {problems && problems.length > 0 && (
                  <Button
                    onClick={() => startTraining(customRatings)}
                    size="lg"
                    className="flex-1 h-10 xs:h-11 sm:h-12 text-sm xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🚀 Start Training
                  </Button>
                )}
              </div>
            </div>
          ) : (
            training && (
              <>
                {isPreContestPeriod ? (
                  // Pre-contest layout: Responsive design
                  <div className="w-full p-3 xs:p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3 xs:space-y-4 text-center">
                      <div className="p-3 xs:p-4 bg-muted/20 rounded-lg">
                        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                          Contest Starts In
                        </div>
                        <CountDown
                          startTime={training.startTime}
                          endTime={training.endTime}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={onStopTraining}
                        className="font-semibold px-4 xs:px-6 py-2 xs:py-3 h-auto w-full transition-all duration-300"
                      >
                        Stop Training
                      </Button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between">
                      <div className="flex-1"></div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">Contest starts in</div>
                        <CountDown
                          startTime={training.startTime}
                          endTime={training.endTime}
                        />
                      </div>
                      <div className="flex-1 flex justify-end">
                        <Button
                          variant="destructive"
                          onClick={onStopTraining}
                          className="font-semibold px-6 md:px-8 h-12 transition-all duration-300"
                        >
                          Stop Training
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // During contest layout: Responsive design
                  <div className="w-full p-3 xs:p-4 sm:p-6">
                    {/* Mobile Layout (Stack vertically) */}
                    <div className="block sm:hidden space-y-3 xs:space-y-4">
                      {/* Timer at top on mobile */}
                      <div className="text-center p-3 xs:p-4 bg-muted/20 rounded-lg">
                        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                          Time Remaining
                        </div>
                        <CountDown
                          startTime={training.startTime}
                          endTime={training.endTime}
                        />
                      </div>

                      {/* Buttons row on mobile */}
                      <div className="grid grid-cols-3 gap-1 xs:gap-2">
                        <Button
                          variant="outline"
                          onClick={refreshProblemStatus}
                          className="font-semibold px-1 xs:px-2 py-2 xs:py-3 h-auto text-xs border-2 hover:border-primary/50 transition-all duration-300"
                          disabled={isRefreshing}
                        >
                          <RefreshCw
                            className={`h-3 w-3 xs:h-4 xs:w-4 ${isRefreshing ? "animate-spin" : ""}`}
                          />
                          <span className="ml-1 hidden xs:inline">
                            {isRefreshing ? "..." : "Refresh"}
                          </span>
                        </Button>

                        <Button
                          onClick={onFinishTraining}
                          className="font-semibold px-1 xs:px-2 py-2 xs:py-3 h-auto text-xs bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                        >
                          <span className="text-xs">🏆</span>
                          <span className="ml-1">Finish</span>
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={onStopTraining}
                          className="font-semibold px-1 xs:px-2 py-2 xs:py-3 h-auto text-xs transition-all duration-300"
                        >
                          <span className="text-xs">⛔</span>
                          <span className="ml-1">Stop</span>
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout (Single row) */}
                    <div className="hidden sm:flex sm:items-center gap-4 md:gap-6">
                      <Button
                        variant="outline"
                        onClick={refreshProblemStatus}
                        className="font-semibold px-4 md:px-6 lg:px-8 h-12 border-2 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                        disabled={isRefreshing}
                      >
                        <RefreshCw
                          className={`h-5 w-5 mr-2 md:mr-3 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        <span className="hidden md:inline">
                          {isRefreshing ? "Refreshing..." : "Refresh Status"}
                        </span>
                        <span className="md:hidden">
                          {isRefreshing ? "..." : "Refresh"}
                        </span>
                      </Button>

                      <div className="flex-1 text-center min-w-0">
                        <div className="text-sm text-muted-foreground mb-2">Time remaining</div>
                        <CountDown
                          startTime={training.startTime}
                          endTime={training.endTime}
                        />
                      </div>

                      <div className="flex gap-2 md:gap-3 flex-shrink-0">
                        <Button
                          onClick={onFinishTraining}
                          className="font-semibold px-4 md:px-6 lg:px-8 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          🏆 <span className="ml-1 md:ml-2">Finish</span>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={onStopTraining}
                          className="font-semibold px-4 md:px-6 lg:px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <span className="hidden sm:inline">Stop</span>
                          <span className="sm:hidden">⛔</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Trainer;
