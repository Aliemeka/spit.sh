import React from "react";

interface Props {
  size: number;
  strokeWidth?: number;
  /** Rotation in degrees, applied around the square's centre */
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedSquare = ({
  size,
  strokeWidth = 2,
  rotation = 0,
  className = "",
  style,
}: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-shape-color ${className}`}
    style={style}
  >
    <g transform={`rotate(${rotation}, 50, 50)`}>
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);

export default AnimatedSquare;
