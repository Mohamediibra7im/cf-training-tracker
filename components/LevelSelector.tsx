"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
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
    const [showRatings, setShowRatings] = useState(true);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-10 bg-muted rounded"></div>
                            <div className="h-10 bg-muted rounded"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-3xl font-semibold">
                    Contest Problems Level
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Show/Hide Ratings Button */}
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRatings((prev) => !prev)}
                        className="mb-2"
                    >
                        {showRatings ? "Hide Ratings" : "Show Ratings"}
                    </Button>
                </div>

                {/* Level Display */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                        Level {currentLevel?.level || "1"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Performance: {currentLevel?.Performance || "900"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Time: {currentLevel?.time || "120"} minutes
                    </div>
                </div>

                {/* Level Controls */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={decreaseLevel}
                        disabled={selectedLevelId <= 1}
                        className="h-12 w-12"
                    >
                        <ChevronDown className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium">Current Level</span>
                        <span className="text-lg font-bold">{selectedLevelId}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={increaseLevel}
                        disabled={selectedLevelId >= levels.length}
                        className="h-12 w-12"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </Button>
                </div>

                {/* Problem Ratings Display */}
                <div className="grid grid-cols-2 gap-4">
                    {currentLevel && (
                        <>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Problem A</div>
                                <div
                                    className={`text-lg font-bold text-primary ${!showRatings ? "blur-sm select-none" : ""}`}
                                >
                                    {currentLevel.P1}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Problem B</div>
                                <div
                                    className={`text-lg font-bold text-primary ${!showRatings ? "blur-sm select-none" : ""}`}
                                >
                                    {currentLevel.P2}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Problem C</div>
                                <div
                                    className={`text-lg font-bold text-primary ${!showRatings ? "blur-sm select-none" : ""}`}
                                >
                                    {currentLevel.P3}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Problem D</div>
                                <div
                                    className={`text-lg font-bold text-primary ${!showRatings ? "blur-sm select-none" : ""}`}
                                >
                                    {currentLevel.P4}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Reset Button */}
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={resetToDefault}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        {user && user.rating
                            ? "Reset to Default Level"
                            : "Reset to Default Level"}
                    </Button>
                </div>

                {/* Level Range Info */}
                <div className="text-center text-xs text-muted-foreground">
                    Levels 1-{levels.length} available
                </div>
            </CardContent>
        </Card>
    );
};

export default LevelSelector;
