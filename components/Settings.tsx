"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { validatePassword } from "@/utils/passwordValidation";
import useUser from "@/hooks/useUser";
import { User, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield } from "lucide-react";

const Settings = () => {
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!password) {
      setError("Password is required.");
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!confirmPassword) {
        setError("Please confirm your password.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors.join(". "));
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = isLogin
        ? await login(codeforcesHandle, password)
        : await register(codeforcesHandle, password, confirmPassword);

      if (!response.success) {
        setError(response.error || "An unknown error occurred.");
      } else {
        if (!isLogin) {
          setSuccess("Registration successful! You are now logged in.");
        }
        // On successful login, the parent component will re-render and show the profile
      }
    } catch (_err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 space-y-4">
        <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLogin
              ? "Sign in to continue your coding journey"
              : "Create your account and start training"
            }
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl text-center font-bold">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Codeforces Handle Input */}
            <div className="space-y-2">
              <label
                htmlFor="codeforcesHandle"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-primary" />
                Codeforces Handle
              </label>
              <div className="relative">
                <Input
                  id="codeforcesHandle"
                  type="text"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  required
                  placeholder="Enter your Codeforces handle"
                  className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Your username from{" "}
                <Link
                  href="https://codeforces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  codeforces.com
                </Link>
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </label>
                {isLogin && (
                  <Link
                    href="/reset-password"
                    className="text-sm text-primary hover:underline transition-colors flex items-center gap-1"
                  >
                    Forgot Password?
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && <PasswordStrengthIndicator password={password} />}
            </div>

            {/* Confirm Password for Registration */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter your password"
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
            )}

            {/* Error and Success Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-600 text-center">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Form Toggle */}
          <div className="mt-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <button
              onClick={handleToggleForm}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {isLogin
                ? "Don't have an account? Create one now"
                : "Already have an account? Sign in instead"}
            </button>

            {/* Codeforces registration link */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Don&apos;t have a Codeforces account?
              </p>
              <Link
                href="https://codeforces.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 font-medium"
              >
                Create one on Codeforces
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
