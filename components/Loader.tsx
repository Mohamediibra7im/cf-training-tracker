"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const Loader = ({ fullScreen = true, message = "Loading...", size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen bg-background" 
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-40 h-40 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-32 h-32 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main loader content */}
        <div className="relative flex flex-col items-center space-y-6 z-10">
          {/* Spinning loader with gradient rings */}
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              {/* Outer rotating ring with gradient */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin"></div>
              </div>
              
              {/* Middle rotating ring (reverse direction) */}
              <div className="absolute inset-2 rounded-full">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-accent border-l-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>

              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-primary animate-spin`} 
                  style={{ animationDuration: '1.2s' }}
                />
              </div>
            </div>
          </div>

          {/* Loading text with gradient */}
          <div className="text-center space-y-3">
            <p className={`${textSizeClasses[size]} font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent`}>
              {message}
            </p>
            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
