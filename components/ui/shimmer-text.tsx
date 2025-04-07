import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type ShimmerTextProps = {
  text: string;
  shimmerWidth?: number; // in pixels
  shimmerDuration?: number; // in miliseconds
  className?: string;
}

const ShimmerText = ({text, shimmerWidth = 100, shimmerDuration = 2000,  className} : ShimmerTextProps) => {
  return (
    <span 
        style={{
            "--shimmer-width": `${shimmerWidth}px`,
            "--shimmer-duration": `${shimmerDuration}ms`,
        } as React.CSSProperties}
        className={cn(
            "inline-block text-secondary-600/50", 
            "bg-clip-text bg-no-repeat bg-gradient-to-r from-transparent via-secondary-900 to-transparent",
            `animate-[shimmer-text_var(--shimmer-duration)_linear_infinite] [background-position:0_0] [background-size:var(--shimmer-width)_100%]`,
            className
        )}
    >
        {text}
    </span>
  );
}

export default ShimmerText;