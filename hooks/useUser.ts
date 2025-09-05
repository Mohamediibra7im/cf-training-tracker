import { useEffect, useState, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { User } from "@/types/User";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";

const USER_CACHE_KEY = "codeforces-user";

const useUser = () => {
  const [isClient, setIsClient] = useState(false);
  const {
    data: user,
    isLoading,
    mutate,
    error,
  } = useSWR<User | null>(
    USER_CACHE_KEY,
    null, // We will manage fetching manually or from localStorage
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only attempt to load user from localStorage after client hydration
    if (!isClient) return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      mutate(JSON.parse(storedUser), false);
    } else {
      // If no stored user, mark loading as complete
      mutate(null, false);
    }
  }, [mutate, isClient]);

  const login = useCallback(
    async (codeforcesHandle: string, password: string): Promise<Response<User>> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codeforcesHandle, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return ErrorResponse(data.message);
        }

        // Save token and user to localStorage for persistent sessions
        if (isClient) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        await mutate(data.user, false);
        return SuccessResponse(data.user);
      } catch (_error) {
        return ErrorResponse("Failed to connect to the server.");
      }
    },
    [isClient, mutate],
  );

  const register = useCallback(
    async (codeforcesHandle: string, password: string, confirmPassword: string): Promise<Response<User>> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codeforcesHandle, password, confirmPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          return ErrorResponse(data.message);
        }
        // After successful registration, automatically log the user in
        return await login(codeforcesHandle, password);
      } catch (_error) {
        return ErrorResponse("Failed to connect to the server.");
      }
    },
    [login],
  );

  const logout = () => {
    if (isClient) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    mutate(null, false);
  };

  const resetPassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<Response<null>> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/reset-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        return ErrorResponse(data.message);
      }

      return SuccessResponse(null);
    } catch (_error) {
      return ErrorResponse("Failed to connect to the server.");
    }
  };

  const syncProfile = useCallback(async (): Promise<Response<User>> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return ErrorResponse("Not authenticated");
      }

      const res = await fetch("/api/auth/sync-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        return ErrorResponse(data.message);
      }

      // Update localStorage with new user data
      if (isClient && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        await mutate(data.user, false);
      }

      return SuccessResponse(data.user);
    } catch (_error) {
      return ErrorResponse("Failed to sync profile");
    }
  }, [isClient, mutate]);

  return {
    user,
    isLoading: isLoading || !isClient,
    error,
    register,
    login,
    logout,
    resetPassword,
    syncProfile,
  };
};

export default useUser;
