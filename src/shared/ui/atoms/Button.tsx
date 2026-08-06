import React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { Text } from "./Text";
import { Spinner } from "./Spinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "brand"
  | "success"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
type ButtonSize = "sm" | "default" | "lg";

const BG_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  brand: "bg-brand",
  success: "bg-success",
  destructive: "bg-destructive",
  outline: "bg-transparent border border-foreground",
  ghost: "bg-transparent",
  link: "bg-transparent",
};

const TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  brand: "text-brand-foreground",
  success: "text-success-foreground",
  destructive: "text-destructive-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-link underline",
};

const ICON_COLOR: Record<ButtonVariant, string> = {
  primary: "rgb(var(--color-primary-foreground))",
  secondary: "rgb(var(--color-secondary-foreground))",
  brand: "rgb(var(--color-brand-foreground))",
  success: "rgb(var(--color-success-foreground))",
  destructive: "rgb(var(--color-destructive-foreground))",
  outline: "rgb(var(--color-foreground))",
  ghost: "rgb(var(--color-foreground))",
  link: "rgb(var(--color-link))",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-10 min-w-[140px] px-4",
  default: "h-12 min-w-[140px] px-6",
  lg: "h-[52px] min-w-[140px] px-8",
};

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "default",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const iconColor = ICON_COLOR[variant];

  function renderIcon(icon: React.ReactNode) {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        color: iconColor,
      });
    }
    return icon;
  }

  const isDisabled = disabled || isLoading;
  const isLinkVariant = variant === "link";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      className={twMerge(
        "flex-row items-center justify-center",
        isLinkVariant ? "px-0 h-auto" : "rounded-full",
        !isLinkVariant && SIZE_CLASS[size],
        fullWidth && "w-full",
        BG_CLASS[variant],
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color={iconColor} className="mr-2" />
      ) : (
        leftIcon && <View className="mr-2">{renderIcon(leftIcon)}</View>
      )}

      <Text variant="button" className={TEXT_CLASS[variant]}>
        {title}
      </Text>

      {!isLoading && rightIcon && (
        <View className="ml-2">{renderIcon(rightIcon)}</View>
      )}
    </TouchableOpacity>
  );
}
