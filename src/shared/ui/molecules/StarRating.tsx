import { Pressable, View } from "react-native";
import { StarIcon as StarIconSolid } from "react-native-heroicons/solid";
import { StarIcon as StarIconOutline } from "react-native-heroicons/outline";

import { cn } from "@/src/shared/utils/cn";

interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
  className?: string;
}

// Standard 1-5 tap-to-rate stars — filled up to the selected value, outline
// after it. No half-star support since the backend's `ratings` field is a
// plain integer (see reviewTypes.ts), not a decimal.
export function StarRating({
  value,
  onChange,
  max = 5,
  size = 32,
  className = "",
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <View
      className={cn("flex-row gap-1", className)}
      accessibilityRole="adjustable"
      accessibilityLabel="Rating"
      accessibilityValue={{ min: 1, max, now: value ?? undefined }}
    >
      {stars.map((star) => {
        const isFilled = value !== null && star <= value;
        const Icon = isFilled ? StarIconSolid : StarIconOutline;

        return (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
            hitSlop={6}
            className="active:opacity-60"
          >
            <Icon
              width={size}
              height={size}
              color={
                isFilled
                  ? "rgb(var(--color-warning))"
                  : "rgb(var(--color-muted-foreground))"
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}
