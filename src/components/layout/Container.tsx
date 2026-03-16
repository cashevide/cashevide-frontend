import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
  variant?: 'narrow' | 'desktop' | 'full';
  className?: string;
  safeArea?: boolean;
}

export function Container({
  variant = 'full',
  className = '',
  safeArea = false,
  children,
  ...props
}: ContainerProps) {

  const getMaxWidthClass = () => {
    switch (variant) {
      case 'narrow': return 'max-w-[480px]';
      case 'desktop': return 'max-w-[1200px]';
      case 'full': return 'w-full';
      default: return 'w-full';
    }
  };

  const InnerView = (
    <View
      className={twMerge(
        'flex-1 w-full mx-auto bg-background',
        getMaxWidthClass(),
        className
      )}
      {...props}
    >
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {InnerView}
      </SafeAreaView>
    );
  }

  return InnerView;
}
