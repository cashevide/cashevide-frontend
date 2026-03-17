import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface SpinnerProps extends ActivityIndicatorProps {
  variant?: 'primary' | 'brand' | 'muted' | 'success' | 'destructive' | 'white';
  className?: string;
}

export function Spinner({
  size = 'small',
  variant = 'primary',
  color,
  className = '',
  ...props
}: SpinnerProps) {

  const getColor = () => {
    if (color) return color;
    switch (variant) {
      case 'primary': return 'var(--color-foreground)';
      case 'brand': return 'var(--color-brand)';
      case 'muted': return 'var(--color-muted-foreground)';
      case 'success': return 'var(--color-success)';
      case 'destructive': return 'var(--color-destructive)';
      case 'white': return '#ffffff';
      default: return 'var(--color-foreground)';
    }
  };

  return (
    <ActivityIndicator
      size={size}
      color={getColor()}
      className={twMerge('', className)}
      {...props}
    />
  );
}
