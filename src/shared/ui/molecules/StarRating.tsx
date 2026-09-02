import { Pressable, View } from "react-native";
import { StarIcon as StarIconSolid } from "react-native-heroicons/solid";
import { StarIcon as StarIconOutline } from "react-native-heroicons/outline";

import { cn } from "@/src/shared/utils/cn";

interface StarRatingProps {
  value: number | null;
  // Omit for a read-only display (e.g. showing an average rating) —
  // stars render but aren't pressable. Provided means interactive
  // tap-to-rate, same as before.
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  className?: string;
}

// Renders one star's fill state. Interactive/integer ratings (the
// original behavior) are a single fully-filled-or-not icon swap — no
// overlay needed. Read-only fractional ratings (e.g. an average of
// 4.2) need a partial fill on the boundary star, which React Native
// can't do with CSS clip-path — instead this stacks a solid star
// underneath an outline star, absolutely positioned, and clips the
// solid star's own width to the fill percentage via a plain
// overflow-hidden View. That's the standard partial-star technique in
// RN since fractional icon fonts/SVG clipping aren't reliably
// supported across platforms.
function Star({ fillFraction, size }: { fillFraction: number; size: number }) {
  if (fillFraction <= 0) {
    return (
      <StarIconOutline
        width={size}
        height={size}
        color="rgb(var(--color-muted-foreground))"
      />
    );
  }

  if (fillFraction >= 1) {
    return (
      <StarIconSolid
        width={size}
        height={size}
        color="rgb(var(--color-warning))"
      />
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <StarIconOutline
        width={size}
        height={size}
        color="rgb(var(--color-muted-foreground))"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${fillFraction * 100}%`,
          height: size,
          overflow: "hidden",
        }}
      >
        <StarIconSolid
          width={size}
          height={size}
          color="rgb(var(--color-warning))"
        />
      </View>
    </View>
  );
}

// Standard 1-5 tap-to-rate stars — filled up to the selected value, outline
// after it. Integer values fill/don't fill each star fully (no partial
// fill) when interactive, since the backend's `ratings` field is a plain
// integer (see reviewTypes.ts). Read-only mode (no onChange) additionally
// supports fractional values for displaying an average rating, with a
// partial fill on the boundary star.
export function StarRating({
  value,
  onChange,
  max = 5,
  size = 32,
  className = "",
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);
  const isReadOnly = !onChange;

  return (
    <View
      className={cn("flex-row gap-1", className)}
      accessibilityRole={isReadOnly ? undefined : "adjustable"}
      accessibilityLabel="Rating"
      accessibilityValue={
        isReadOnly ? undefined : { min: 1, max, now: value ?? undefined }
      }
    >
      {stars.map((star) => {
        // Read-only: fractional fill against the exact value (e.g.
        // value=4.2, star=4 → 1.0 fill, star=5 → 0.2 fill). Interactive:
        // integer-only, fully filled or not — no partial star while
        // actively rating.
        const fillFraction = isReadOnly
          ? Math.max(0, Math.min(1, (value ?? 0) - (star - 1)))
          : value !== null && star <= value
            ? 1
            : 0;

        const starNode = <Star fillFraction={fillFraction} size={size} />;

        if (isReadOnly) {
          return <View key={star}>{starNode}</View>;
        }

        return (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
            hitSlop={6}
            className="active:opacity-60"
          >
            {starNode}
          </Pressable>
        );
      })}
    </View>
  );
}
