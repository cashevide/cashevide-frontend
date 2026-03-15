import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {

  const getBgClass = () => {
    switch (variant) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-input';
      case 'outline': return 'bg-transparent border border-primary';
      case 'ghost': return 'bg-transparent';
      default: return 'bg-primary';
    }
  };

  const getTextClass = () => {
    switch (variant) {
      case 'primary': return 'text-btnText';
      case 'secondary': return 'text-heading';
      case 'outline': return 'text-primary';
      case 'ghost': return 'text-primary';
      default: return 'text-btnText';
    }
  };

  const opacityClass = (disabled || isLoading) ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`w-full flex-row py-4 px-6 rounded-lg items-center justify-center ${getBgClass()} ${opacityClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator
          color={variant === 'primary' ? 'white' : '#3b82f6'}
          className="mr-2"
        />
      )}

      <Text className={`font-bold text-lg ${getTextClass()}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
