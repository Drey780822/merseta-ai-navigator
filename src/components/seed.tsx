import React, { useId } from "react";
import { cn } from "@/lib/utils";

export type SeedState = "idle" | "listening" | "thinking" | "responding" | "uncertain" | "error";

export interface SeedProps {
  state?: SeedState;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * The Seed: LOAM's faceless, pebble-shaped presence mark.
 * Communicates honest epistemic state with zero performed sentience.
 */
export function Seed({
  state = "idle",
  size = 24,
  className,
  ariaLabel = "merSETA intelligence seed",
}: SeedProps) {
  const gradientId = useId();

  return (
    <div
      role="img"
      aria-label={`${ariaLabel} (${state})`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Listening Ripple */}
      {state === "listening" && (
        <span
          className="seed-ripple-anim absolute inset-0 rounded-full border border-tide/50"
          aria-hidden="true"
        />
      )}

      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={cn(
          "transition-transform transition-opacity duration-300",
          state === "idle" && "seed-breath-anim",
          state === "thinking" && "seed-drift-anim",
          state === "responding" && "seed-pulse-anim",
          state === "uncertain" && "opacity-85",
          state === "error" && "grayscale opacity-70",
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#D98E64" />
            <stop offset="50%" stopColor="#E8C48A" />
            <stop offset="100%" stopColor="#9CC3C9" />
          </linearGradient>
        </defs>

        {/* Outer Ring for Thinking state */}
        {state === "thinking" && (
          <circle
            cx="16"
            cy="16"
            r="14.5"
            fill="none"
            stroke="var(--color-tide, #2F6F7E)"
            strokeWidth="1.25"
            strokeDasharray="18 20"
            className="origin-center animate-spin"
            style={{ animationDuration: "3.5s" }}
          />
        )}

        {/* Dashed Ring for Uncertain state */}
        {state === "uncertain" && (
          <circle
            cx="16"
            cy="16"
            r="14.5"
            fill="none"
            stroke="var(--color-ochre, #C8932B)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        )}

        {/* Continuous Superellipse Pebble */}
        <path
          d="M 16,3.2 C 25.2,3.2 28.8,6.8 28.8,16 C 28.8,25.2 25.2,28.8 16,28.8 C 6.8,28.8 3.2,25.2 3.2,16 C 3.2,6.8 6.8,3.2 16,3.2 Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
}
