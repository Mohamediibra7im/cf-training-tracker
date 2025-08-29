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
  customRatings,
  submissionStatus,
}: {
  problem: TrainingProblem;
  index: number;
  isTraining: boolean;
  startTime: number | null;
  customRatings: { P1: number; P2: number; P3: number; P4: number };
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
  const ratingKeys = ["P1", "P2", "P3", "P4"] as const;

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

  const problemRating = customRatings[ratingKeys[index]];

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
      className={`flex items-center justify-between p-2.5 border rounded-lg transition-colors relative ${isPreContestPeriod
        ? "bg-muted cursor-not-allowed opacity-70"
        : overlayClass || "bg-card hover:bg-muted/50"
        }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg w-6 text-center">
            {problemLabels[index]}
          </span>
          {isPreContestPeriod && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-primary">{problem.name}</div>
          <div className="text-muted-foreground">
            {problem.contestId}-{problem.index}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {!isTraining && (
          <span className="font-medium text-muted-foreground">
            {problemRating}
          </span>
        )}
        {isTraining && (
          <span className="text-lg font-medium min-w-[100px] text-right inline-flex items-center justify-end gap-1">
            {getSolvedStatus()}
          </span>
        )}
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
    <Card className="border-2 border-border/50 shadow-lg">
      <CardContent className="pt-8 space-y-8">
        {isStopDialogOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-title"
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50" onClick={cancelStop} />
            <div className="relative z-10 w-[90%] max-w-md">
              <div className="rounded-lg border-2 border-red-500/40 bg-background shadow-xl">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <h3 id="stop-title" className="text-xl font-semibold">Stop training?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will end your current session without saving it. Are you sure you want to stop?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
                    <Button variant="outline" onClick={cancelStop}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmStop}>Stop</Button>
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
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50" onClick={cancelFinish} />
            <div className="relative z-10 w-[90%] max-w-md">
              <div className="rounded-lg border-2 border-yellow-500/40 bg-background shadow-xl">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h3 id="finish-title" className="text-xl font-semibold">Finish training?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We will save your session, add unsolved problems to upsolve reminders, and take you to your statistics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
                    <Button variant="outline" onClick={cancelFinish}>Cancel</Button>
                    <Button onClick={confirmFinish} className="bg-yellow-600 hover:bg-yellow-600/90 text-white">Finish</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Problems Section */}
        {currentProblems && currentProblems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Problems</h3>
            <div className="space-y-1.5">
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
                    customRatings={customRatings}
                    submissionStatus={submissionStatus}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {!isTraining ? (
            <div className="flex justify-center gap-4">
              <Button
                onClick={() =>
                  generateProblems(selectedTags, lb, ub, customRatings)
                }
              >
                {problems && problems.length > 0
                  ? "Regenerate"
                  : "Generate Problems"}
              </Button>
              {problems && problems.length > 0 && (
                <Button onClick={() => startTraining(customRatings)}>
                  Start
                </Button>
              )}
            </div>
          ) : (
            training && (
              <>
                {isPreContestPeriod ? (
                  // Pre-contest layout: Timer center, Stop button far right
                  <div className="flex w-full py-6 items-center justify-between">
                    <div className="flex-1"></div>
                    <div className="text-center">
                      <CountDown
                        startTime={training.startTime}
                        endTime={training.endTime}
                      />
                    </div>
                    <div className="flex-1 flex justify-end">
                      <Button
                        variant="destructive"
                        onClick={onStopTraining}
                        className="text-lg font-semibold px-6 py-3"
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                ) : (
                  // During contest layout: Refresh left, Timer center, Buttons right
                  <div className="flex flex-col lg:flex-row lg:items-center w-full py-6 gap-4">
                    <div className="lg:flex-1 flex justify-center lg:justify-start">
                      <Button
                        variant="outline"
                        onClick={refreshProblemStatus}
                        className="text-lg font-semibold px-6 py-3"
                        disabled={isRefreshing}
                      >
                        <RefreshCw
                          className={`h-5 w-5 mr-3 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                      </Button>
                    </div>
                    <div className="lg:flex-1 text-center">
                      <CountDown
                        startTime={training.startTime}
                        endTime={training.endTime}
                      />
                    </div>
                    <div className="lg:flex-1 flex gap-3 justify-center lg:justify-end">
                      <Button
                        onClick={onFinishTraining}
                        className="text-lg font-semibold px-6 py-3 flex-1 sm:flex-none"
                      >
                        Finish
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={onStopTraining}
                        className="text-lg font-semibold px-6 py-3 flex-1 sm:flex-none"
                      >
                        Stop
                      </Button>
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
