"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnnouncementCardProps {
  className?: string;
}

export function AnnouncementCard({
  className = ""
}: AnnouncementCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className={`border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
              Important: Password Migration Notice
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3 leading-relaxed">
              We&apos;ve upgraded our security system! If you registered before with a 4-digit PIN, please use{" "}
              <Link
                href="/reset-password"
                className="font-medium underline hover:no-underline"
              >
                Forgot Password?
              </Link>{" "}
              to create a new secure password. Your old PIN will no longer work.
            </p>
            <div className="flex items-center gap-2">
              <Link href="/reset-password">
                <Button size="sm" variant="outline" className="text-xs">
                  Reset Password
                </Button>
              </Link>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss announcement</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}