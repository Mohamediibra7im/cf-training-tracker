/* eslint-disable linebreak-style, indent */
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
        <Card className="border-2 border-yellow-500/40 bg-yellow-500/10">
            <CardContent className="py-4 px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm sm:text-base text-foreground flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">We recommend upsolving previous problems before starting the next session.</span>
                    {firstUnsolved && (
                        <span className="text-xs sm:text-sm text-muted-foreground">Next: {firstUnsolved.contestId}-{firstUnsolved.index}</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="default" onClick={onUpsolveNow}>Upsolve Now</Button>
                    <Button variant="outline" onClick={onLater}>Later</Button>
                    <Button variant="destructive" onClick={onGiveUp}>Give Up</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default UpsolveReminder;
