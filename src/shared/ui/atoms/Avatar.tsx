import { useState } from "react";
import { Image, View } from "react-native";
import { UserIcon } from "react-native-heroicons/solid";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "./Text";

type AvatarShape = "circle" | "square";

interface AvatarProps {
  imageUri?: string | null;
  name?: string | null;
  size?: number;
  shape?: AvatarShape;
  className?: string;
  // Image and View don't share a common props type (their `style` shapes
  // differ — ImageStyle vs ViewStyle), so extending either one and
  // spreading it onto the other breaks TypeScript's overload resolution.
  // Only the handful of props actually useful on an avatar are exposed
  // here instead, kept identical across both View/Image render branches.
  testID?: string;
  accessibilityHint?: string;
}

const SHAPE_CLASS: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-md",
};

// First letter of the name, uppercased. Falls back to nothing (renders
// the generic person icon instead) if name is missing/blank.
function getInitial(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "";
}

export function Avatar({
  imageUri,
  name,
  size = 32,
  shape = "circle",
  className = "",
  testID,
  accessibilityHint,
}: AvatarProps) {
  // If the image URL 404s or otherwise fails to load, fall back to the
  // initial/icon rendering instead of leaving a broken image box. Track
  // *which* uri failed so that if the profile later gets a different
  // (working) imageUri, it gets a fresh attempt instead of staying
  // stuck on the fallback.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const imageFailed = imageUri != null && imageUri === failedUri;
  const shapeClass = SHAPE_CLASS[shape];
  const dimensionStyle = { width: size, height: size };

  if (imageUri && !imageFailed) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={dimensionStyle}
        className={cn(shapeClass, className)}
        accessibilityLabel={name ?? "Profile picture"}
        accessibilityHint={accessibilityHint}
        testID={testID}
        onError={() => setFailedUri(imageUri)}
      />
    );
  }

  const initial = getInitial(name);

  if (initial) {
    return (
      <View
        style={dimensionStyle}
        className={cn(
          "items-center justify-center bg-brand",
          shapeClass,
          className,
        )}
        accessibilityLabel={name ?? undefined}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        <Text
          style={{ fontSize: size * 0.42 }}
          className="font-medium text-brand-foreground"
        >
          {initial}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={dimensionStyle}
      className={cn(
        "items-center justify-center bg-muted",
        shapeClass,
        className,
      )}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <UserIcon
        width={size * 0.6}
        height={size * 0.6}
        color="rgb(var(--color-muted-foreground))"
      />
    </View>
  );
}
