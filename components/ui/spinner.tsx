import { cn } from "@/lib/utils"

interface SpinnerProps {
    className?: string
    size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
    }

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-2 border-muted-foreground/20 border-t-current",
                sizeClasses[size],
                className
            )}
        />
    )
}

interface LoadingButtonProps {
    isLoading: boolean
    children: React.ReactNode
    loadingText?: string
    className?: string
}

export function LoadingButton({
    isLoading,
    children,
    loadingText,
    className,
}: LoadingButtonProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {isLoading && <Spinner size="sm" />}
            {isLoading && loadingText ? loadingText : children}
        </div>
    )
}
