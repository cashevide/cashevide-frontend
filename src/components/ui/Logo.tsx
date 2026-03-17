import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export function Logo({
  width = 40,
  height = 40,
  color = 'var(--color-foreground)'

}: LogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
      <Path
        d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zM50 80C33.5 80 20 66.5 20 50s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"
        fill={color}
      />
    </Svg>
  );
}
