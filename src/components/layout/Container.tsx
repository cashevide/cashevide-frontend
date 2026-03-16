import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
  variant?: 'narrow' | 'default' | 'wide' | 'full';
  className?: string;
  safeArea?: boolean;
}

export function Container({
  variant = 'default',
  className = '',
  safeArea = false,
  children,
  ...props
}: ContainerProps) {

  const getMaxWidthClass = () => {
    switch (variant) {
      case 'narrow': return 'max-w-[480px]';
      case 'default': return 'max-w-[1200px]';
      case 'wide': return 'max-w-[1800px]';
      case 'full': return 'w-full';
      default: return 'max-w-[1200px]';
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
