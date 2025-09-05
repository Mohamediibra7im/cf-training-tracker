import useSWR from "swr";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin notifications");
  }

  return res.json();
};

export function useAdminNotifications() {
  const { data, error, mutate } = useSWR("/api/admin/notifications", fetcher);

  return {
    notifications: data || [],
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
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("/api/admin/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(notificationData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create notification");
  }

  return res.json();
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
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("/api/admin/notifications", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...notificationData }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update notification");
  }

  return res.json();
}

export async function deleteNotification(id: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("/api/admin/notifications", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete notification");
  }

  return res.json();
}
