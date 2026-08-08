import { Text as RNText, TextProps } from "react-native";

import { cn } from "@/src/shared/utils/cn";

type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body-lg"
  | "body"
  | "body-sm"
  | "caption"
  | "overline"
  | "link"
  | "button";

const VARIANT_CLASS: Record<TextVariant, string> = {
  display: "text-4xl font-extrabold tracking-tight text-foreground",
  title: "text-3xl font-bold tracking-tight text-foreground",
  heading: "text-2xl font-semibold tracking-tight text-foreground",
  subheading: "text-xl font-semibold tracking-tight text-foreground",

  "body-lg": "text-lg font-medium text-foreground",
  body: "text-base text-foreground",
  "body-sm": "text-sm font-medium text-foreground",

  caption: "text-xs text-muted-foreground",
  overline: "text-xs uppercase tracking-widest font-bold text-muted-foreground",

  link: "text-base font-medium underline text-link",
  button: "text-sm font-medium",
};

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: TextVariant;
}

export function Text({
  className = "",
  variant = "body",
  style,
  ...props
}: CustomTextProps) {
  return (
    <RNText
      className={cn("font-sans", VARIANT_CLASS[variant], className)}
      style={style}
      {...props}
    />
  );
}
