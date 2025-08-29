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
      <section className="container grid items-center gap-6 pb-6 pt-2 md:py-4">
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
      </section>
    );
  }

  return (
    <section className="container grid items-center gap-6 pb-6 pt-2 md:py-4">
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Create a Contest
        </h1>
        <p className="text-sm text-muted-foreground">
          Select problem ratings to generate your custom training session.
        </p>
      </div>

      <div className="space-y-8">
        {/* Level Selector */}
        <LevelSelector
          onLevelChange={handleLevelChange}
          currentRatings={customRatings}
        />

        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6 space-y-8">
            {/* Tags Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Select Tags (Optional)</h3>
              <TagSelector
                allTags={allTags}
                selectedTags={selectedTags}
                onTagClick={onTagClick}
                onClearTags={onClearTags}
              />
            </div>

            {/* Contest Round Range Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">
                Contest Round Range (Optional)
              </h3>
              <Textboxpair
                onFirstInputChange={onFirstInputChange}
                onSecondInputChange={onSecondInputChange}
              />
            </div>


          </CardContent>
        </Card>

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
