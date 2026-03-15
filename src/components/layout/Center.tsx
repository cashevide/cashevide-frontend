import { View, ViewProps } from 'react-native';

export function Center({ className = '', children, ...props }: ViewProps) {
  return (
    <View className={`flex-1 justify-center items-center ${className}`} {...props}>
      {children}
    </View>
  );
}
