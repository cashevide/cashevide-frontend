import { useRef, useState } from "react";
import { TextInput, View } from "react-native";

import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";

interface OtpInputProps {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChangeText,
  length = 6,
  error = false,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function updateDigit(index: number, text: string) {
    // Handles paste: if more than one char lands in a single box, spread
    // it across the remaining boxes starting at `index`.
    const cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned.length > 1) {
      const merged = (value.slice(0, index) + cleaned).slice(0, length);
      onChangeText(merged);

      const nextIndex = Math.min(merged.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    onChangeText(nextDigits.join("").slice(0, length));

    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View className="flex-row justify-center gap-2">
      {digits.map((digit, index) => {
        const state = error
          ? "error"
          : focusedIndex === index
            ? "focused"
            : "default";

        return (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChangeText={(text) => updateDigit(index, text)}
            onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() =>
              setFocusedIndex((prev) => (prev === index ? null : prev))
            }
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            keyboardType="number-pad"
            maxLength={2}
            textAlign="center"
            style={inputFieldWebResetStyle}
            className={getInputFieldClasses({
              state,
              disabled,
              className: "w-12 text-xl font-semibold",
            })}
          />
        );
      })}
    </View>
  );
}
