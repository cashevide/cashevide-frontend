import { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/solid";

import { cn } from "@/src/shared/utils/cn";
import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";
import { Text } from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
}

export function Input({
  label,
  error,
  isPassword = false,
  isSuccess = false,
  disabled = false,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const state = error
    ? "error"
    : isSuccess
      ? "success"
      : isFocused
        ? "focused"
        : "default";

  const hasTrailingIcon = isPassword || !!error || isSuccess;

  return (
    <View className={cn("w-full gap-2", className)}>
      {label && <Text variant="body-sm">{label}</Text>}

      <View className="relative w-full justify-center">
        <TextInput
          style={inputFieldWebResetStyle}
          className={getInputFieldClasses({
            state,
            disabled,
            className: cn("w-full", hasTrailingIcon && "pr-12"),
          })}
          editable={!disabled}
          secureTextEntry={isPassword && !showPassword}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        <View className="absolute right-4 flex-row items-center">
          {!isPassword && error && (
            <XCircleIcon size={18} color="rgb(var(--color-destructive))" />
          )}

          {!isPassword && isSuccess && !error && (
            <CheckCircleIcon size={18} color="rgb(var(--color-success))" />
          )}

          {isPassword && (
            <TouchableOpacity
              className="p-1"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon
                  size={18}
                  color="rgb(var(--color-muted-foreground))"
                />
              ) : (
                <EyeIcon size={18} color="rgb(var(--color-muted-foreground))" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <Text variant="body-sm" className="text-destructive text-center">
          {error}
        </Text>
      )}
    </View>
  );
}
