import { Pressable, PressableProps, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";

import { cn } from "@/src/shared/utils/cn";

interface SwitchProps extends Omit<PressableProps, "onPress"> {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;
const THUMB_MARGIN = 3;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

export function Switch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  className = "",
  ...props
}: SwitchProps) {
  const progress = useDerivedValue(() =>
    withTiming(value ? 1 : 0, { duration: 150 }),
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => onValueChange(!value)}
      className={cn(disabled && "opacity-50", className)}
      {...props}
    >
      <View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
        }}
        className={cn(
          "justify-center",
          value ? "bg-brand" : "bg-disabled-foreground",
        )}
      >
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              marginLeft: THUMB_MARGIN,
            },
            thumbStyle,
          ]}
        >
          <View
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
            }}
            className="bg-white"
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}
