import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'subheading' | 'body' | 'caption';
}

export function Text({ className = '', variant = 'body', style, ...props }: CustomTextProps) {
  const variantStyles = {
    h1: "text-heading text-4xl font-bold",
    h2: "text-heading text-3xl font-bold",
    h3: "text-heading text-2xl font-semibold",
    subheading: "text-heading text-lg font-medium opacity-80",

    body: "text-body text-base",
    caption: "text-body text-sm opacity-60",
  };

  return (
    <RNText
      className={`font-sans ${variantStyles[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
}
