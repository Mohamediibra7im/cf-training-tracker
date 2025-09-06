"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, RotateCcw, Trophy, Clock, Target, Zap } from "lucide-react";
import { useLevels } from "@/hooks/useLevels";
import useUser from "@/hooks/useUser";

interface LevelSelectorProps {
  onLevelChange: (ratings: {
    P1: number;
    P2: number;
    P3: number;
    P4: number;
  }) => void;
  currentRatings: { P1: number; P2: number; P3: number; P4: number };
}

const LevelSelector = ({
  onLevelChange,
  currentRatings,
}: LevelSelectorProps) => {
  const { levels, isLoading, getDefaultLevel, getLevelByPerformance } =
    useLevels();
  const { user } = useUser();
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // Helper function to get problem difficulty color
  const getProblemDifficultyColor = (rating: number) => {
    if (rating < 1200) return "from-gray-400 to-gray-600";
    if (rating < 1400) return "from-green-400 to-green-600";
    if (rating < 1600) return "from-cyan-400 to-cyan-600";
    if (rating < 1900) return "from-blue-400 to-blue-600";
    if (rating < 2100) return "from-purple-400 to-purple-600";
    if (rating < 2300) return "from-orange-400 to-orange-600";
    if (rating < 2400) return "from-orange-500 to-orange-700";
    return "from-red-400 to-red-600";
  };

  useEffect(() => {
    if (levels.length > 0) {
      // Find the level that matches current ratings
      const matchingLevel = levels.find(
        (level) =>
          parseInt(level.P1) === currentRatings.P1 &&
          parseInt(level.P2) === currentRatings.P2 &&
          parseInt(level.P3) === currentRatings.P3 &&
          parseInt(level.P4) === currentRatings.P4,
      );

      if (matchingLevel) {
        setSelectedLevelId(matchingLevel.id);
      } else if (user && user.rating) {
        // If no matching level found and user has a rating, set appropriate level
        const userLevel = getLevelByPerformance(user.rating);
        if (userLevel) {
          setSelectedLevelId(userLevel.id);
          // Update the ratings to match the user's level
          onLevelChange({
            P1: parseInt(userLevel.P1),
            P2: parseInt(userLevel.P2),
            P3: parseInt(userLevel.P3),
            P4: parseInt(userLevel.P4),
          });
        }
      }
    }
  }, [levels, currentRatings, user, getLevelByPerformance, onLevelChange]);

  const handleLevelChange = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    if (level) {
      setSelectedLevelId(levelId);
      onLevelChange({
        P1: parseInt(level.P1),
        P2: parseInt(level.P2),
        P3: parseInt(level.P3),
        P4: parseInt(level.P4),
      });
    }
  };

  const increaseLevel = () => {
    if (selectedLevelId < levels.length) {
      handleLevelChange(selectedLevelId + 1);
    }
  };

  const decreaseLevel = () => {
    if (selectedLevelId > 1) {
      handleLevelChange(selectedLevelId - 1);
    }
  };

  const resetToDefault = () => {
    if (user && user.rating) {
      // Reset to user's appropriate level based on their rating
      const userLevel = getLevelByPerformance(user.rating);
      if (userLevel) {
        handleLevelChange(userLevel.id);
      }
    } else {
      // Fallback to level 1 if no user rating
      const defaultLevel = getDefaultLevel();
      if (defaultLevel) {
        handleLevelChange(defaultLevel.id);
      }
    }
  };

  const currentLevel = levels.find((level) => level.id === selectedLevelId);

  // State to show/hide ratings
  const [showRatings, setShowRatings] = useState(false);

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-muted/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <CardHeader className="relative p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted/50 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="truncate">Contest Problems Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div className="animate-pulse space-y-6">
            {/* Level display skeleton */}
            <div className="text-center space-y-4">
              <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 sm:p-6">
                <div className="h-8 sm:h-10 md:h-12 bg-muted rounded-lg w-24 sm:w-32 mx-auto mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="h-12 sm:h-16 bg-muted/30 rounded-lg"></div>
                  <div className="h-12 sm:h-16 bg-muted/30 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Level controls skeleton */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-muted rounded-full"></div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-muted rounded-full"></div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-muted rounded-full"></div>
            </div>

            {/* Problem ratings skeleton */}
            <div className="space-y-4">
              <div className="h-5 sm:h-6 bg-muted rounded w-32 sm:w-48 mx-auto"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4">
                    <div className="text-center space-y-2 sm:space-y-3">
                      <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20 mx-auto"></div>
                      <div className="h-5 sm:h-6 bg-muted rounded w-8 sm:w-12 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  } return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-muted/30 w-full max-w-none">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      </div>

      <CardHeader className="relative pb-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <span className="truncate">Contest Problems Level</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRatings((prev) => !prev)}
            className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 w-full sm:w-auto"
          >
            <Target className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{showRatings ? "Hide Ratings" : "Show Ratings"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Level Display with enhanced styling */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-background/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Level {currentLevel?.level || "1"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Performance:</span>
                  <span className="font-bold text-foreground">{currentLevel?.Performance || "900"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-bold text-foreground">{currentLevel?.time || "120"}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Level Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseLevel}
            disabled={selectedLevelId <= 1}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>

          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Current Level</span>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-30"></div>
              <div className="relative bg-background border-2 border-primary/30 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {selectedLevelId}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={increaseLevel}
            disabled={selectedLevelId >= levels.length}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        {/* Problem Ratings Display */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-center text-foreground">Problem Difficulty Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentLevel && (
              <>
                {[
                  { label: "Problem A", rating: currentLevel.P1, color: getProblemDifficultyColor(parseInt(currentLevel.P1)) },
                  { label: "Problem B", rating: currentLevel.P2, color: getProblemDifficultyColor(parseInt(currentLevel.P2)) },
                  { label: "Problem C", rating: currentLevel.P3, color: getProblemDifficultyColor(parseInt(currentLevel.P3)) },
                  { label: "Problem D", rating: currentLevel.P4, color: getProblemDifficultyColor(parseInt(currentLevel.P4)) }
                ].map((problem) => (
                  <div
                    key={problem.label}
                    className="relative group transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 group-hover:border-primary/30 transition-all duration-300">
                      <div className="text-center space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${problem.color} shadow-lg flex-shrink-0`}></div>
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">{problem.label}</span>
                        </div>
                        <div className="relative">
                          <div
                            className={`text-lg sm:text-xl font-bold transition-all duration-300 ${!showRatings
                              ? "blur-sm select-none text-muted-foreground"
                              : `bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`
                            }`}
                          >
                            {problem.rating}
                          </div>
                          {!showRatings && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
                                Hidden
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Reset Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 hover:scale-105 hover:text-green-500 hover:font-semibold w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base text-center">
              {user && user.rating ? "Reset to Recommended Level" : "Reset to Default Level"}
            </span>
          </Button>
        </div>

        {/* Enhanced Level Range Info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted/30 rounded-full border border-border/50">
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Levels 1-{levels.length} available
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelSelector;
