import { Text as RNText, TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?:
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'large'
  | 'body'
  | 'small'
  | 'muted'
  | 'caption'
  | 'overline'
  | 'link'
  | 'button';
}

export function Text({ className = '', variant = 'body', style, ...props }: CustomTextProps) {
  const variantStyles = {
    // 1. Headings
    h1: "text-foreground text-4xl font-extrabold tracking-tight",
    h2: "text-foreground text-3xl font-bold tracking-tight",
    h3: "text-foreground text-2xl font-semibold tracking-tight",
    h4: "text-foreground text-xl font-semibold tracking-tight",

    // 2. Body Text
    large: "text-body-text text-lg font-medium",
    body: "text-body-text text-base",
    small: "text-body-text text-sm font-medium",

    // 3. Muted & Micro-copy
    muted: "text-muted-foreground text-sm",
    caption: "text-muted-foreground text-xs",
    overline: "text-muted-foreground text-[10px] uppercase tracking-widest font-bold",

    // 4. Interactive elements
    link: "text-brand text-base font-medium underline",
    button: "text-base font-semibold",
  };

  return (
    <RNText
      className={twMerge(`font-sans ${variantStyles[variant]}`, className)}
      style={style}
      {...props}
    />
  );
}
