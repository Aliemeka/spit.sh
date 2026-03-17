import React from "react";

interface Props {
  size: number;
  strokeWidth?: number;
  /** Rotation in degrees, applied around the triangle's centre */
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedTriangle = ({
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
      <polygon
        points="50,6 7,91 93,91"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default AnimatedTriangle;
