"use client";

import { useEffect, useMemo, useState } from "react";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toast";
import { Lightbulb } from "lucide-react";
import { usePathname } from "next/navigation";

const SNOOZE_STORAGE_KEY = "training-tracker-upsolve-snoozed";

const UpsolveReminder = () => {
  const { upsolvedProblems, deleteUpsolvedProblem, isLoading } = useUpsolvedProblems();
  const { toast } = useToast();
  const [snoozed, setSnoozed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (typeof window.sessionStorage === "undefined") return;
      const val = window.sessionStorage.getItem(SNOOZE_STORAGE_KEY);
      setSnoozed(val === "1");
    } catch (err) {
      console.error("Failed to read snooze from sessionStorage", err);
      setSnoozed(false);
    }
  }, []);

  // Reset snooze on route changes so the reminder re-evaluates without requiring logout/login
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        window.sessionStorage.removeItem(SNOOZE_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
    setSnoozed(false);
  }, [pathname]);

  const firstUnsolved = useMemo(() => {
    if (!upsolvedProblems || upsolvedProblems.length === 0) return null;
    return upsolvedProblems.find((p) => !p.solvedTime) || null;
  }, [upsolvedProblems]);

  if (isLoading || snoozed || !firstUnsolved) return null;

  const onUpsolveNow = () => {
    if (!firstUnsolved) return;
    const win = window.open(firstUnsolved.url, "_blank");
    if (win) {
      toast({
        title: "Upsolve now",
        description: `${firstUnsolved.contestId}-${firstUnsolved.index} opened in a new tab`,
        variant: "default",
      });
    } else {
      toast({
        title: "Unable to open new tab",
        description: "Please allow popups or use the link directly.",
        variant: "destructive",
      });
    }
  };

  const onLater = () => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        window.sessionStorage.setItem(SNOOZE_STORAGE_KEY, "1");
      }
      setSnoozed(true);
      toast({
        title: "Reminder snoozed",
        description: "We'll remind you next visit.",
        variant: "warning",
      });
    } catch (err) {
      console.error("Failed to persist snooze to sessionStorage", err);
      setSnoozed(true);
      toast({
        title: "Snoozed (not persisted)",
        description: "We'll remind you again next time due to browser settings.",
        variant: "warning",
      });
    }
  };

  const onGiveUp = async () => {
    if (!firstUnsolved) return;
    try {
      await deleteUpsolvedProblem(firstUnsolved);
      toast({
        title: "Removed from reminders",
        description: `${firstUnsolved.contestId}-${firstUnsolved.index} was removed`,
        variant: "destructive",
      });
    } catch {
      // no-op
    }
  };

  return (
    <Card className="border-2 border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-yellow-500/10 backdrop-blur-sm shadow-lg overflow-hidden relative w-full animate-in slide-in-from-top-2 duration-500">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>

      <CardContent className="relative py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* Message Section */}
          <div className="flex flex-col items-center lg:items-start gap-3 flex-1 min-w-0 text-center lg:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-full flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                We recommend upsolving previous problems before starting the next session.
              </span>
            </div>

            {firstUnsolved && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center lg:justify-start">
                <span className="text-xs sm:text-sm text-muted-foreground">Next problem:</span>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 rounded-lg border border-yellow-500/30 w-fit mx-auto lg:mx-0">
                  <span className="text-sm font-mono font-medium text-yellow-700 dark:text-yellow-300">
                    {firstUnsolved.contestId}-{firstUnsolved.index}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0 justify-center">
            <Button
              variant="default"
              onClick={onUpsolveNow}
              className="w-full sm:flex-1 lg:w-auto lg:min-w-[120px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm">Upsolve Now</span>
            </Button>
            <Button
              variant="outline"
              onClick={onLater}
              className="w-full sm:flex-1 lg:w-auto lg:min-w-[120px] border-yellow-500/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-500/60 transition-all duration-300"
            >
              <span className="text-sm">Remind Later</span>
            </Button>
            <Button
              variant="destructive"
              onClick={onGiveUp}
              className="w-full sm:flex-1 lg:w-auto lg:min-w-[120px] bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm">Remove</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpsolveReminder;
