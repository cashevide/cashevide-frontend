import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from './Text';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  isSuccess?: boolean;
}

export function Input({
  label,
  error,
  isPassword = false,
  isSuccess = false,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  let borderClass = 'border-border';
  if (error) borderClass = 'border-destructive';
  else if (isSuccess) borderClass = 'border-success';

  return (
    <View className={twMerge('w-full mb-4', className)}>

      {label && (
        <Text variant="small" className="mb-2">{label}</Text>
      )}

      <View className="relative w-full justify-center">
        <TextInput
          className={twMerge(
            'w-full h-[56px] px-4 bg-input text-foreground rounded-[16px] border placeholder:text-muted-foreground',
            borderClass,
            (isPassword || error || isSuccess) ? 'pr-12' : ''
          )}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        <View className="absolute right-4 flex-row items-center">

          {!isPassword && error && (
            <XCircleIcon size={18} color="var(--color-destructive)" />
          )}

          {!isPassword && isSuccess && !error && (
            <CheckCircleIcon size={18} color="var(--color-success)" />
          )}

          {isPassword && (
            <TouchableOpacity
              className="p-1"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon size={18} color="var(--color-muted-foreground)" />
              ) : (
                <EyeIcon size={18} color="var(--color-muted-foreground)" />
              )}
            </TouchableOpacity>
          )}
        </View>

      </View>

      {error && (
        <Text variant="small" className="text-destructive mt-1">{error}</Text>
      )}

    </View>
  );
}
