import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

type SpinnerSize = "sm" | "default" | "lg";

const SIZE_MAP: Record<SpinnerSize, number | "small" | "large"> = {
  sm: "small",
  default: "small",
  lg: "large",
};

interface SpinnerProps extends Omit<ActivityIndicatorProps, "size"> {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

export function Spinner({
  size = "default",
  color = "rgb(var(--color-foreground))",
  className = "",
  ...props
}: SpinnerProps) {
  return (
    <ActivityIndicator
      size={SIZE_MAP[size]}
      color={color}
      className={className}
      {...props}
    />
  );
}
