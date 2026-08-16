import React from "react";
import { Pressable, PressableProps, View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
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
type ButtonSize = "sm" | "default" | "lg" | "icon";

const BG_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  brand: "bg-brand",
  success: "bg-success/15",
  destructive: "bg-destructive/15",
  outline: "bg-secondary border border-border",
  ghost: "bg-transparent",
  link: "bg-transparent",
};

const TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  brand: "text-brand-foreground",
  success: "text-success-text",
  destructive: "text-destructive-text",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-link underline",
};

const ICON_COLOR: Record<ButtonVariant, string> = {
  primary: "rgb(var(--color-primary-foreground))",
  secondary: "rgb(var(--color-secondary-foreground))",
  brand: "rgb(var(--color-brand-foreground))",
  success: "rgb(var(--color-success-text))",
  destructive: "rgb(var(--color-destructive-text))",
  outline: "rgb(var(--color-foreground))",
  ghost: "rgb(var(--color-foreground))",
  link: "rgb(var(--color-link))",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-11 min-w-[100px] px-4",
  default: "h-12 min-w-[120px] px-6",
  lg: "h-14 min-w-[140px] px-8",
  icon: "h-12 w-12",
};

interface ButtonProps extends PressableProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  className?: string;
}

export function Button({
  title,
  variant = "primary",
  size = "default",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  icon,
  fullWidth = false,
  className = "",
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const iconColor = ICON_COLOR[variant];
  const isIconOnly = size === "icon";

  function renderIcon(iconNode: React.ReactNode) {
    if (React.isValidElement(iconNode)) {
      return React.cloneElement(iconNode as React.ReactElement<any>, {
        color: iconColor,
      });
    }
    return iconNode;
  }

  const isDisabled = disabled || isLoading;
  const isLinkVariant = variant === "link";

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      className={cn(
        "flex-row items-center justify-center",
        isLinkVariant ? "px-0 h-auto" : "rounded-full",
        !isLinkVariant && SIZE_CLASS[size],
        fullWidth && !isIconOnly && "w-full",
        BG_CLASS[variant],
        "active:opacity-60",
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size="sm"
          color={iconColor}
          className={isIconOnly ? "" : "mr-2"}
        />
      ) : isIconOnly ? (
        renderIcon(icon)
      ) : (
        leftIcon && <View className="mr-2">{renderIcon(leftIcon)}</View>
      )}

      {!isIconOnly && (
        <Text variant="button" className={TEXT_CLASS[variant]}>
          {title}
        </Text>
      )}

      {!isLoading && !isIconOnly && rightIcon && (
        <View className="ml-2">{renderIcon(rightIcon)}</View>
      )}
    </Pressable>
  );
}
