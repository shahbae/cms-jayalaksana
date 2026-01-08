import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
    className,
    type,
    startIcon,
    endIcon,
    ...props
}: React.ComponentProps<'input'> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}) {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    if (StartIcon || EndIcon) {
        return (
            <div className={cn('relative w-full', className)}>
                {StartIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
                        {StartIcon}
                    </div>
                )}
                <input
                    type={type}
                    data-slot="input"
                    className={cn(
                        'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        StartIcon && 'pl-9',
                        EndIcon && 'pr-9',
                        className,
                    )}
                    {...props}
                />
                {EndIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                        {EndIcon}
                    </div>
                )}
            </div>
        );
    }

    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                className,
            )}
            {...props}
        />
    );
}

export { Input };

