"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNotificationPanel from "@/components/AdminNotificationPanel";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";

export default function AdminNotificationsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/");
        return;
      }

      if (user.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminNotificationPanel />
    </div>
  );
}
