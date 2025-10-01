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
    throw new Error("Failed to fetch admin users");
  }

  return res.json();
};

export function useAdminUsers() {
  const { data, error, mutate } = useSWR("/api/admin/users", fetcher, {
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
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update user role");
  }

  return res.json();
}
