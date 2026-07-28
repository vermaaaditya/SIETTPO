import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";
//button
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0A1628] text-[#F5F0E8] hover:bg-[#1E2A3A] focus-visible:ring-[#0A1628]",
        gold: "bg-[#C9922A] text-[#0A1628] font-bold shadow-md shadow-[#C9922A]/15 hover:translate-y-[-2px] hover:brightness-[0.92] hover:shadow-lg hover:shadow-[#C9922A]/25 focus-visible:ring-[#C9922A]",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-600/90 focus-visible:ring-red-500",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-500",
        ghost: "bg-transparent text-[#F5F0E8] border-2 border-[#F5F0E8]/30 hover:text-[#C9922A] hover:border-[#C9922A] text-[11px] tracking-wider uppercase font-bold",
        ghostDark: "bg-transparent text-[#0A1628] border-2 border-[#0A1628]/25 hover:text-[#C9922A] hover:border-[#C9922A] text-[11px] tracking-wider uppercase font-bold",
        link: "text-[#C9922A] hover:text-[#0A1628] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
