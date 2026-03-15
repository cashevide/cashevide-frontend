import { View, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {
  variant?: 'default' | 'wide' | 'full';
  className?: string;
}

export function Container({
  variant = 'default',
  className = '',
  children,
  ...props
}: ContainerProps) {

  const getMaxWidthClass = () => {
    switch (variant) {
      case 'default': return 'max-w-[1200px]';
      case 'wide': return 'max-w-[1800px]';
      case 'full': return 'w-full';
      default: return 'max-w-[1200px]';
    }
  };

  return (
    <View
      className={`w-full mx-auto ${getMaxWidthClass()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
