import React from 'react';
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'brand' | 'primary' | 'secondary' | 'success' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {

  const getBgClass = () => {
    switch (variant) {
      case 'brand': return 'bg-brand';
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'success': return 'bg-success';
      case 'destructive': return 'bg-destructive';
      case 'outline': return 'bg-transparent border border-foreground';
      case 'ghost': return 'bg-transparent';
      default: return 'bg-foreground';
    }
  };

  const getTextClass = () => {
    switch (variant) {
      case 'brand': return 'text-brand-foreground';
      case 'primary': return 'text-primary-foreground';
      case 'secondary': return 'text-secondary-foreground';
      case 'success': return 'text-success-foreground';
      case 'destructive': return 'text-destructive-foreground';
      case 'outline': return 'text-foreground';
      case 'ghost': return 'text-foreground';
      default: return 'text-background';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'brand': return 'var(--color-brand-foreground)';
      case 'primary': return 'var(--color-primary-foreground)';
      case 'secondary': return 'var(--color-secondary-foreground)';
      case 'success': return 'var(--color-success-foreground)';
      case 'destructive': return 'var(--color-destructive-foreground)';
      case 'outline': return 'var(--color-foreground)';
      case 'ghost': return 'var(--color-foreground)';
      default: return 'var(--color-background)';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-[40px] min-w-[140px] px-4';
      case 'lg':
        return 'h-[52px] min-w-[140px] px-8';
      default:
        return 'h-[48px] min-w-[140px] px-6';
    }
  };

  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        color: getIconColor(),
      });
    }
    return icon;
  };

  const opacityClass = (disabled || isLoading) ? 'opacity-50' : 'opacity-100';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={twMerge(
        'flex-row rounded-full items-center justify-center',
        getSizeClass(),
        widthClass,
        getBgClass(),
        opacityClass,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={getIconColor()}
          className="mr-2"
        />
      ) : (
        leftIcon && <View className="mr-2">{renderIcon(leftIcon)}</View>
      )}

      <Text variant='button' className={getTextClass()}>
        {title}
      </Text>

      {!isLoading && rightIcon && <View className="ml-2">{renderIcon(rightIcon)}</View>}
    </TouchableOpacity>
  );
}
