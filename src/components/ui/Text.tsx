import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'subheading' | 'body' | 'caption';
}

export function Text({ className = '', variant = 'body', style, ...props }: CustomTextProps) {
  const variantStyles = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    subheading: "text-lg font-medium opacity-80",
    body: "text-base",
    caption: "text-sm opacity-60",
  };

  return (
    <RNText
      className={`font-sans text-text ${variantStyles[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
}
