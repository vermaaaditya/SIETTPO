import * as React from "react";
import { cn } from "../../lib/utils";
//label
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-bold uppercase tracking-wider text-[#0A1628] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
