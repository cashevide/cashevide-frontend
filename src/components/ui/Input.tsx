import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useState } from 'react';
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
    <View className={`w-full mb-4 ${className}`}>
      {label && (
        <Text className="mb-2 font-medium text-heading">{label}</Text>
      )}
      <View className="relative w-full justify-center">
        <TextInput
          className={`w-full bg-input text-body p-4 rounded-lg ${error ? 'border border-red-500' : 'border border-transparent'
            }`}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 p-2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text variant="caption" className="text-primary font-semibold">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
