import { useState, useEffect } from "react";

export interface Level {
  id: number;
  level: string;
  time: string;
  Performance: string;
  P1: string;
  P2: string;
  P3: string;
  P4: string;
}

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const response = await fetch("/data/level.json");
        if (!response.ok) {
          throw new Error("Failed to load levels");
        }
        const data = await response.json();
        setLevels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load levels");
      } finally {
        setIsLoading(false);
      }
    };

    loadLevels();
  }, []);

  const getLevelByPerformance = (performance: number): Level | null => {
    return (
      levels.find((level) => parseInt(level.Performance) >= performance) || null
    );
  };

  const getLevelById = (id: number): Level | null => {
    return levels.find((level) => level.id === id) || null;
  };

  const getDefaultLevel = (): Level | null => {
    // Default to level 1 (800-900 performance range)
    return levels.find((level) => level.id === 1) || null;
  };

  return {
    levels,
    isLoading,
    error,
    getLevelByPerformance,
    getLevelById,
    getDefaultLevel,
  };
};
