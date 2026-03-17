import React from "react";

interface Props {
  size: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedCircle = ({
  size,
  strokeWidth = 2,
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
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

export default AnimatedCircle;
