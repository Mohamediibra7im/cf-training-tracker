import useSWR from "swr";
import { apiFetcher } from "@/lib/apiClient";

export interface AdminStats {
  activeNotifications: number;
  totalNotifications: number;
  totalUsers: number;
  adminUsers: number;
}

const defaultStats: AdminStats = {
  activeNotifications: 0,
  totalNotifications: 0,
  totalUsers: 0,
  adminUsers: 0,
};

const fetcher = (url: string) => apiFetcher<AdminStats>(url);

export function useAdminStats() {
  const { data, error, mutate } = useSWR<AdminStats>("/api/admin/stats", fetcher, {
    // Optimize for dashboard
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    refreshInterval: 120000, // 2 minutes
  });

  return {
    stats: data || defaultStats,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
