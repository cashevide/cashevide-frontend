import { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import {
  MagnifyingGlassIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";

import { cn } from "@/src/shared/utils/cn";
import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";

interface SearchInputProps extends Omit<TextInputProps, "value"> {
  value: string;
  onClear?: () => void;
  className?: string;
}

// Search-specific input: leading magnifying-glass icon, trailing clear
// button that only shows once there's text to clear. Shares Input's
// token system (getInputFieldClasses) but doesn't use Input itself —
// the two icon slots (leading search icon, trailing conditional clear)
// don't fit Input's existing trailing-only icon slot cleanly.
export function SearchInput({
  value,
  onClear,
  className = "",
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("relative w-full justify-center", className)}>
      <View className="absolute left-4 z-10">
        <MagnifyingGlassIcon
          width={18}
          height={18}
          color="rgb(var(--color-muted-foreground))"
        />
      </View>

      <TextInput
        value={value}
        style={inputFieldWebResetStyle}
        className={getInputFieldClasses({
          state: isFocused ? "focused" : "default",
          className: cn("w-full pl-11", value && "pr-11"),
        })}
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

      {value.length > 0 && onClear && (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          className="absolute right-4 z-10"
        >
          <XCircleIcon
            width={18}
            height={18}
            color="rgb(var(--color-muted-foreground))"
          />
        </Pressable>
      )}
    </View>
  );
}
