import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  isPassword = false,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={twMerge('w-full mb-4', className)}>

      {label && (
        <Text className="mb-2 font-medium text-foreground">{label}</Text>
      )}

      <View className="relative w-full justify-center">
        <TextInput
          className={twMerge(
            'w-full bg-input text-foreground p-4 rounded-lg border',
            error ? 'border-destructive' : 'border-transparent'
          )}
          placeholderTextColor="#a1a1aa"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 p-2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text variant="caption" className="text-foreground font-semibold">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-destructive text-sm mt-1">{error}</Text>
      )}

    </View>
  );
}
