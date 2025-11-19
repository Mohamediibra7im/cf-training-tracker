import useSWR from "swr";
import { apiFetcher } from "@/lib/apiClient";
import { User } from "@/types/User";

interface AdminUsersResponse {
  users: User[];
}

const fetcher = (url: string) => apiFetcher<AdminUsersResponse>(url);

export function useAdminUsers() {
  const { data, error, mutate } = useSWR<AdminUsersResponse>("/api/admin/users", fetcher, {
    // Optimize for fast loading
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    refreshInterval: 300000, // 5 minutes
  });

  return {
    users: data?.users || [],
    totalUsers: data?.users?.length || 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  return apiFetcher("/api/admin/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, role }),
  });
}
