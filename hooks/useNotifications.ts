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
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
};

export function useNotifications() {
  const { data, error, mutate } = useSWR("/api/notifications", fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  });

  return {
    notifications: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useNotificationCount() {
  const { data, error, mutate } = useSWR("/api/notifications/count", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });

  return {
    unreadCount: data?.unreadCount || 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function markNotificationAsRead(notificationId: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("/api/notifications/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationId }),
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return res.json();
}

export async function deleteNotification(notificationId: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete notification");
  }

  return res.json();
}
