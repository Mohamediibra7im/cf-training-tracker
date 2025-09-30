import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Training } from "@/types/Training";
import { getAccuratePerformance } from "@/utils/getPerformance";
import useUser from "@/hooks/useUser";


const fetcher = async (url: string) => {
  if (typeof window === "undefined") return [];

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trainings");
  }

  return res.json();
};

const useHistory = () => {
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();
  const {
    data: history,
    error,
    mutate,
  } = useSWR<Training[]>(isClient ? "/api/trainings" : null, fetcher);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addTraining = useCallback(
    async (training: Training) => {
      if (!isClient) return;

      // Use the user's current rating for accurate performance calculation
      const userRating = user?.rating || 1500; // Default to 1500 if rating not available
      const performance = getAccuratePerformance(training, userRating);
      const newTraining = { ...training, performance };

      const token = localStorage.getItem("token");

      try {
        await fetch("/api/trainings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTraining),
        });
        // Revalidate the SWR cache to show the new training
        mutate();
      } catch (error) {
        console.error(error);
      }
    },
    [isClient, mutate, user?.rating],
  );

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const deleteTraining = useCallback(
    async (trainingId: string) => {
      if (isDeleting) return;

      setIsDeleting(trainingId);

      // Optimistic update
      mutate(
        (currentData = []) =>
          currentData.filter((training) => training._id !== trainingId),
        false,
      );

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/trainings/${trainingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete training");
        }
      } catch (error) {
        console.error("Error deleting training:", error);
        // Rollback on error
        mutate();
      } finally {
        setIsDeleting(null);
      }
    },
    [mutate, isDeleting],
  );

  return {
    history: history || [],
    isLoading: (!error && !history) || !isClient,
    error,
    addTraining,
    deleteTraining,
    isDeleting,
  };
};

export default useHistory;
