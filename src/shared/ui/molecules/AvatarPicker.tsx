import { useEffect, useState, type ReactNode } from "react";
import { Image, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  CameraIcon,
  TrashIcon,
  PhotoIcon,
} from "react-native-heroicons/outline";

import {
  isImageTooLarge,
  MAX_IMAGE_SIZE_MB,
} from "@/src/shared/utils/imageSize";
import { Text } from "../atoms/Text";
import { Spinner } from "../atoms/Spinner";
import { Divider } from "../atoms/Divider";
import { Modal } from "./Modal";

type AvatarPickerProps = {
  imageUri: string | null | undefined;
  onPick: (asset: { uri: string; name: string; type: string }) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  isError?: boolean;
  shape?: "circle" | "square";
  placeholderText?: string;
  fileName?: string;
  // Defaults to 80 (the size this component always used before this
  // prop existed) — pass a larger value for screens that want the
  // photo more prominent, like a personal profile's own avatar. The
  // camera badge scales proportionally so it doesn't look undersized
  // next to a larger photo.
  size?: number;
};

const SHAPE_CLASS: Record<"circle" | "square", string> = {
  circle: "rounded-full",
  square: "rounded-md",
};

function ActionRow({
  icon,
  label,
  destructive = false,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 py-3 active:opacity-60"
    >
      {icon}
      <Text
        variant="body"
        className={destructive ? "text-destructive" : "text-foreground"}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const AvatarPicker = ({
  imageUri,
  onPick,
  onRemove,
  isUploading = false,
  isError = false,
  shape = "circle",
  placeholderText = "Add Photo",
  fileName = "image.jpg",
  size = 80,
}: AvatarPickerProps) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // Clear the optimistic preview once the mutation settles (success or
  // error) — on success the fresh `imageUri` from the server takes over;
  // on error we fall back to the previous `imageUri` automatically.
  useEffect(() => {
    if (!isUploading && previewUri) {
      setPreviewUri(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  async function handlePickImage() {
    setIsActionSheetOpen(false);
    setSizeError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];

    if (isImageTooLarge(asset)) {
      setSizeError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setPreviewUri(asset.uri);
    onPick({
      uri: asset.uri,
      name: fileName,
      type: asset.mimeType ?? "image/jpeg",
    });
  }

  function handleRemove() {
    setIsActionSheetOpen(false);
    onRemove?.();
  }

  const displayUri = previewUri ?? imageUri;
  const shapeClass = SHAPE_CLASS[shape];
  const hasImage = !!displayUri;
  // 30% of the avatar size — matches the original fixed 24px badge on
  // the original fixed 80px avatar (24/80 = 0.3), so it scales with
  // size instead of looking undersized on a larger photo.
  const badgeSize = Math.round(size * 0.3);
  const badgeIconSize = Math.round(badgeSize * 0.5);

  return (
    <View className="items-center gap-1">
      <Pressable
        onPress={() => setIsActionSheetOpen(true)}
        className="relative active:opacity-80"
      >
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={{ height: size, width: size }}
            className={shapeClass}
          />
        ) : (
          <View
            style={{ height: size, width: size }}
            className={`items-center justify-center bg-muted ${shapeClass}`}
          >
            <Text
              variant="caption"
              className="text-muted-foreground text-center px-2"
            >
              {placeholderText}
            </Text>
          </View>
        )}

        {/* Camera badge overlay — signals this image is tappable/editable,
            distinct from the read-only Avatar atom which has no such
            affordance. Sized proportionally to the avatar (see
            badgeSize above) rather than a fixed size. */}
        <View
          style={{ height: badgeSize, width: badgeSize }}
          className="absolute bottom-0 right-0 items-center justify-center rounded-full bg-primary border-2 border-background"
        >
          <CameraIcon
            width={badgeIconSize}
            height={badgeIconSize}
            color="rgb(var(--color-primary-foreground))"
          />
        </View>
      </Pressable>

      {isUploading && (
        <View className="flex-row items-center gap-1.5">
          <Spinner size="sm" />
          <Text variant="caption" className="text-muted-foreground">
            Uploading...
          </Text>
        </View>
      )}
      {isError && !isUploading && (
        <Text variant="caption" className="text-destructive">
          Upload failed. Try again.
        </Text>
      )}
      {sizeError && (
        <Text variant="caption" className="text-destructive">
          {sizeError}
        </Text>
      )}

      {/* Action sheet — tap avatar to open, choose to change or remove
          the photo. "Remove Photo" only shows when there's an
          onRemove handler AND an existing image to remove. */}
      <Modal
        visible={isActionSheetOpen}
        dismissible
        onDismiss={() => setIsActionSheetOpen(false)}
      >
        <View>
          <ActionRow
            icon={
              <PhotoIcon
                width={20}
                height={20}
                color="rgb(var(--color-foreground))"
              />
            }
            label={hasImage ? "Change Photo" : "Add Photo"}
            onPress={handlePickImage}
          />

          {hasImage && onRemove && (
            <>
              <Divider />
              <ActionRow
                icon={
                  <TrashIcon
                    width={20}
                    height={20}
                    color="rgb(var(--color-destructive-text))"
                  />
                }
                label="Remove Photo"
                destructive
                onPress={handleRemove}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};
