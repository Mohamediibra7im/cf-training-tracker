"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/Toast";
import {
  CheckCircle2,
  KeyRound,
  Clock,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { validatePassword } from "@/utils/passwordValidation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stage, setStage] = useState<"enterHandle" | "verify" | "resetPassword">(
    "enterHandle"
  );
  const [handle, setHandle] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === "verify" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setError("Verification time expired. Please try again.");
      setStage("enterHandle");
    }
    return () => clearInterval(timer);
  }, [stage, countdown]);

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) {
      setError("Please enter your Codeforces handle.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/initiate-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle }),
    });

    const data = await res.json();
    if (res.ok) {
      setVerificationToken(data.verificationToken);
      setStage("verify");
      setCountdown(120); // Reset countdown
    } else {
      setError(data.message || "Failed to start verification.");
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/verify-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationToken }),
    });

    const data = await res.json();
    if (res.ok) {
      setResetToken(data.resetToken);
      setStage("resetPassword");
    } else {
      setError(data.message || "Verification failed.");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setError("New password is required.");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(". "));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/reset-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      toast({
        title: "Password Reset Successful!",
        description: "You can now log in with your new password",
        variant: "success",
        durationMs: 4000
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setError(data.message || "Failed to reset password.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-start pt-8 md:pt-16 pb-8 px-4">
      <div className="w-full max-w-md">
        {/* Back to Login Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Secure your account with a new password
            </p>
          </div>
        </div>

        <Card className="shadow-lg">{ }
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {stage === "enterHandle" && (
                <>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                </>
              )}
              {stage === "verify" && (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                </>
              )}
              {stage === "resetPassword" && (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </>
              )}
            </div>
            <CardTitle className="text-xl text-center">
              {stage === "enterHandle" && "Enter Your Handle"}
              {stage === "verify" && "Verification Required"}
              {stage === "resetPassword" && "Set New Password"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stage === "enterHandle" && (
              <form onSubmit={handleStartVerification} className="space-y-6">
                <CardDescription className="text-center">
                  Enter your Codeforces handle to start the password reset process.
                  We&apos;ll guide you through a secure verification process.
                </CardDescription>
                <div className="space-y-2">
                  <label htmlFor="handle" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Codeforces Handle
                  </label>
                  <div className="relative">
                    <Input
                      id="handle"
                      type="text"
                      placeholder="Enter your Codeforces handle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      required
                      className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Starting Verification...
                    </div>
                  ) : (
                    "Start Verification Process"
                  )}
                </Button>
              </form>
            )}

            {stage === "verify" && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <CardDescription className="text-sm">
                      Go to{" "}
                      <a
                        href="https://codeforces.com/problemset/problem/4/A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Codeforces Problem 4A
                        <ExternalLink className="h-3 w-3" />
                      </a>{" "}
                      and make a submission that results in a{" "}
                      <span className="font-bold text-red-600">compilation error</span>.
                    </CardDescription>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-sm text-muted-foreground">Time remaining to submit</p>
                  </div>
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Verifying Submission...
                    </div>
                  ) : (
                    "I have submitted, Verify Now"
                  )}
                </Button>
              </div>
            )}

            {stage === "resetPassword" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center space-y-4 mb-6">
                  <div className="bg-green-500/10 p-4 rounded-full border-2 border-green-500/30 w-fit mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <CardDescription>
                    <span className="text-green-600 font-semibold">Verification successful!</span>
                    <br />You can now set a new password for your account.
                  </CardDescription>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4 text-primary" />
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={newPassword} />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmNewPassword"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4 text-primary" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      required
                      className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Reset Password
                    </div>
                  )}
                </Button>
              </form>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
