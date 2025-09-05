"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { KeyRound } from "lucide-react";
import { validatePassword } from "@/utils/passwordValidation";
import useUser from "@/hooks/useUser";

const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { resetPassword } = useUser();

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }

    if (!newPassword) {
      setError("New password is required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(currentPassword, newPassword);
      if (response.success) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          setOpen(false);
          handleReset();
        }, 1500);
      } else {
        setError(response.error || "Failed to change password.");
      }
    } catch (_error) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    handleReset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold rounded-lg btn-enhanced hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/8 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <KeyRound className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
          <span className="relative z-10">Change Password</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
          <SheetDescription>
            Enter your current password and create a new strong password.
          </SheetDescription>
        </SheetHeader>
        <div className="mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <PasswordStrengthIndicator password={newPassword} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-500 text-center">{success}</p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChangePasswordDialog;
