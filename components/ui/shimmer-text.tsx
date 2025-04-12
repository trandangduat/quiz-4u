import { cn } from "@/lib/utils";
import { Circle, CircleAlert, CircleDot, CircleFadingArrowUp, Dot, LoaderCircle } from "lucide-react";

type ShimmerTextProps = {
  text: string;
  shimmerWidth?: number; // in pixels
  shimmerDuration?: number; // in miliseconds
  className?: string;
}

const ShimmerText = ({text, shimmerWidth = 100, shimmerDuration = 2000, className} : ShimmerTextProps) => {
  return (
    <span
        style={{
            "--shimmer-width": `${shimmerWidth}px`,
            "--shimmer-duration": `${shimmerDuration}ms`,
        } as React.CSSProperties}
        className={cn(
            "flex items-center gap-2 text-secondary-500/40",
            "bg-clip-text bg-no-repeat bg-gradient-to-r from-transparent via-primary-950 to-transparent",
            `animate-[shimmer-text_var(--shimmer-duration)_linear_infinite] [background-position:0_0] [background-size:var(--shimmer-width)_100%]`,
            className
        )}
    >
        <CircleDot size={16} className="animate-pulse" />
        {text}
    </span>
  );
}

export default ShimmerText;