import useSWR from "swr";
import { apiFetcher } from "@/lib/apiClient";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
  isActive: boolean;
  priority: "low" | "medium" | "high";
  targetAudience: "all" | "admins" | "users";
  createdBy: {
    _id: string;
    codeforcesHandle: string;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

interface AdminNotificationsResponse {
  notifications: Notification[];
}

const fetcher = (url: string) => apiFetcher<AdminNotificationsResponse>(url);

export function useAdminNotifications() {
  const { data, error, mutate } = useSWR<AdminNotificationsResponse>("/api/admin/notifications", fetcher, {
    // Optimize for fast loading and better UX
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    refreshInterval: 300000, // 5 minutes
    errorRetryInterval: 5000, // 5 seconds
    errorRetryCount: 3,
  });

  return {
    notifications: data?.notifications || [],
    totalNotifications: data?.notifications?.length || 0,
    activeNotifications: data?.notifications?.filter((n) => n.isActive).length || 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function createNotification(notificationData: {
  title: string;
  message: string;
  type?: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
  priority?: "low" | "medium" | "high";
  targetAudience?: "all" | "admins" | "users";
  expiresAt?: string;
}) {
  return apiFetcher("/api/admin/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });
}

export async function updateNotification(
  id: string,
  notificationData: Partial<{
    title: string;
    message: string;
    type: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
    priority: "low" | "medium" | "high";
    targetAudience: "all" | "admins" | "users";
    isActive: boolean;
    expiresAt: string;
  }>
) {
  return apiFetcher("/api/admin/notifications", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...notificationData }),
  });
}

export async function deleteNotification(id: string) {
  return apiFetcher("/api/admin/notifications", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}
