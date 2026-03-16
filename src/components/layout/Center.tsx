import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

export function Center({ className = '', children, ...props }: ViewProps) {
  return (
    <View
      className={twMerge('flex-1 justify-center items-center', className)}
      {...props}
    >
      {children}
    </View>
  );
}
