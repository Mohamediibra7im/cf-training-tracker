import useSWR from "swr";
import { swrFetcher } from "@/lib/apiClient";

export function useAdminStats() {
  const { data, error, mutate } = useSWR("/api/admin/stats", swrFetcher, {
    // Optimize for dashboard
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    refreshInterval: 120000, // 2 minutes
  });

  return {
    stats: data || {
      activeNotifications: 0,
      totalNotifications: 0,
      totalUsers: 0,
      adminUsers: 0,
    },
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
