import { cn } from "../../lib/utils";
import * as React from "react";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full bg-white border-[1.5px] border-[#0A1628]/12 px-4 py-2.5 text-sm text-[#0A1628] shadow-sm transition-all placeholder:text-[#0A1628]/30 focus-visible:outline-none focus-visible:border-[#C9922A] focus-visible:ring-3 focus-visible:ring-[#C9922A]/12 disabled:cursor-not-allowed disabled:opacity-50",
        type === "search" &&
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
        type === "file" &&
          "p-0 pr-3 italic text-slate-400 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-slate-200 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-slate-900",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
//input
export { Input };
