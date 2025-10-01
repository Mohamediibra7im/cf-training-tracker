import useSWR from "swr";

const fetcher = async (url: string) => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin stats");
  }

  return res.json();
};

export function useAdminStats() {
  const { data, error, mutate } = useSWR("/api/admin/stats", fetcher, {
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
