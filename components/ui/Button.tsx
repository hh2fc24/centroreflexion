import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-[5px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bd6f3c] disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-[#172017] text-white shadow-sm hover:bg-[#233122]": variant === "default",
                        "border border-[#ded5c7] bg-transparent shadow-sm hover:bg-[#f8f5ee] hover:text-[#171713]":
                            variant === "outline",
                        "hover:bg-[#f8f5ee] hover:text-[#171713]": variant === "ghost",
                        "h-9 px-4 py-2": size === "default",
                        "h-8 px-3 text-xs": size === "sm",
                        "h-10 px-8": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
