"use client";

import useTraining from "@/hooks/useTraining";
import Trainer from "@/components/Trainer";
import useBounds from "@/hooks/useBounds";
import { Card, CardContent } from "@/components/ui/card";
import { Textboxpair } from "@/components/ui/textboxpair";
import { useState, useEffect } from "react";
import TagSelector from "@/components/TagSelector";
import LevelSelector from "@/components/LevelSelector";
import useTags from "@/hooks/useTags";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";
import UpsolveReminder from "@/components/UpsolveReminder";

export default function TrainingPage() {
  const { user } = useUser();
  const { allTags, selectedTags, onTagClick, onClearTags } = useTags();
  const {
    startTraining,
    stopTraining,
    problems,
    training,
    isTraining,
    isLoading,
    isRefreshing,
    refreshProblemStatus,
    finishTraining,
    generateProblems,
    submissionStatuses,
  } = useTraining();
  const { firstInput, secondInput, onFirstInputChange, onSecondInputChange } =
    useBounds();

  const [customRatings, setCustomRatings] = useState<{
    P1: number;
    P2: number;
    P3: number;
    P4: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("training-tracker-customRatings");
      if (stored) return JSON.parse(stored);
    }
    // Default will be set by LevelSelector based on user rating
    return { P1: 800, P2: 800, P3: 800, P4: 800 };
  });

  useEffect(() => {
    localStorage.setItem(
      "training-tracker-customRatings",
      JSON.stringify(customRatings),
    );
  }, [customRatings]);


  const handleLevelChange = (ratings: {
    P1: number;
    P2: number;
    P3: number;
    P4: number;
  }) => {
    setCustomRatings(ratings);
  };

  if (isLoading) {
    return <Loader />;
  }

  // Wait for user data to be loaded from localStorage
  if (!user) {
    return <Loader />;
  }

  // If training is active, show only the problems section
  if (isTraining) {
    return (
      <section className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
          <UpsolveReminder />

          {/* Training Header */}
          <div className="text-center p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Training Session Active
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Focus mode enabled. Good luck with your problems!
            </p>
          </div>

          <Trainer
            isTraining={isTraining}
            training={training}
            problems={problems}
            generateProblems={generateProblems}
            startTraining={startTraining}
            stopTraining={stopTraining}
            refreshProblemStatus={refreshProblemStatus}
            finishTraining={finishTraining}
            selectedTags={selectedTags}
            lb={firstInput}
            ub={secondInput}
            customRatings={customRatings}
            submissionStatuses={submissionStatuses}
            isRefreshing={isRefreshing}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 lg:space-y-10">
        <UpsolveReminder />

        {/* Hero Section */}
        <div className="text-center p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Create Your Contest
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            Craft the perfect training session with customizable problem ratings, tags, and contest rounds to elevate your competitive programming skills.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Level Selector */}
          <LevelSelector
            onLevelChange={handleLevelChange}
            currentRatings={customRatings}
          />

          {/* Configuration Panel */}
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Tags Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    Select Tags
                  </h3>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground w-fit">
                    Optional
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <TagSelector
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagClick={onTagClick}
                    onClearTags={onClearTags}
                  />
                </div>
              </div>

              {/* Contest Round Range Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    Contest Round Range
                  </h3>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground w-fit">
                    Optional
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <Textboxpair
                    onFirstInputChange={onFirstInputChange}
                    onSecondInputChange={onSecondInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trainer Section */}
          <Trainer
            isTraining={isTraining}
            training={training}
            problems={problems}
            generateProblems={generateProblems}
            startTraining={startTraining}
            stopTraining={stopTraining}
            refreshProblemStatus={refreshProblemStatus}
            finishTraining={finishTraining}
            selectedTags={selectedTags}
            lb={firstInput}
            ub={secondInput}
            customRatings={customRatings}
            submissionStatuses={submissionStatuses}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>
    </section>
  );
}
