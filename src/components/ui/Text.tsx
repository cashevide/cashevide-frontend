import { Text as RNText, TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'subheading' | 'body' | 'caption' | 'button';
}

export function Text({ className = '', variant = 'body', style, ...props }: CustomTextProps) {
  const variantStyles = {
    h1: "text-foreground text-4xl font-bold",
    h2: "text-foreground text-3xl font-bold",
    h3: "text-foreground text-2xl font-semibold",

    subheading: "text-muted-foreground text-lg font-medium",

    body: "text-foreground text-base",

    caption: "text-muted-foreground text-sm",

    button: "text-lg font-bold",
  };

  return (
    <RNText
      className={twMerge(`font-sans ${variantStyles[variant]}`, className)}
      style={style}
      {...props}
    />
  );
}
