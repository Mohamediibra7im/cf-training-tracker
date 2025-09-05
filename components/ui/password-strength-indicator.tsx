"use client";

import { getPasswordStrengthLevel } from "@/utils/passwordValidation";

interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

export function PasswordStrengthIndicator({ password, className = "" }: PasswordStrengthIndicatorProps) {
    const strength = getPasswordStrengthLevel(password);

    const getStrengthColor = () => {
        switch (strength) {
            case 'weak': return 'bg-red-500';
            case 'fair': return 'bg-orange-500';
            case 'good': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthWidth = () => {
        switch (strength) {
            case 'weak': return 'w-1/4';
            case 'fair': return 'w-2/4';
            case 'good': return 'w-3/4';
            case 'strong': return 'w-full';
            default: return 'w-0';
        }
    };

    if (!password) return null;

    return (
        <div className={`space-y-1 ${className}`}>
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Password strength:</span>
                <span className={`text-sm font-medium capitalize ${strength === 'weak' ? 'text-red-500' :
                    strength === 'fair' ? 'text-orange-500' :
                        strength === 'good' ? 'text-yellow-600' :
                            'text-green-500'
                    }`}>
                    {strength}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                />
            </div>
        </div>
    );
}
