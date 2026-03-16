import React from 'react';
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Text } from './Text';
import GoogleIcon from '@/assets/icons/google-icon.svg';

interface GoogleButtonProps extends TouchableOpacityProps {
  title?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function GoogleButton({
  title = "Continue with Google",
  isLoading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}: GoogleButtonProps) {

  const opacityClass = (disabled || isLoading) ? 'opacity-50' : 'opacity-100';
  const widthClass = fullWidth ? 'w-full' : 'self-start';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={twMerge(
        'flex-row h-[52px] px-6 rounded-full items-center justify-center bg-white border border-border dark:border-transparent',
        widthClass,
        opacityClass,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#000000" className="mr-2" />
      ) : (
        <View className="mr-3">
          <GoogleIcon width={24} height={24} />
        </View>
      )}

      <Text variant='button' className="text-black">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
