import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  isImageTooLarge,
  MAX_IMAGE_SIZE_MB,
} from "@/src/shared/utils/imageSize";

type AvatarPickerProps = {
  imageUri: string | null | undefined;
  onPick: (asset: { uri: string; name: string; type: string }) => void;
  isUploading?: boolean;
  isError?: boolean;
  shape?: "circle" | "square";
  placeholderText?: string;
  fileName?: string;
};

export const AvatarPicker = ({
  imageUri,
  onPick,
  isUploading = false,
  isError = false,
  shape = "circle",
  placeholderText = "Add Photo",
  fileName = "image.jpg",
}: AvatarPickerProps) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Clear the optimistic preview once the mutation settles (success or
  // error) — on success the fresh `imageUri` from the server takes over;
  // on error we fall back to the previous `imageUri` automatically.
  useEffect(() => {
    if (!isUploading && previewUri) {
      setPreviewUri(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  const handlePress = async () => {
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
  };

  const displayUri = previewUri ?? imageUri;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handlePress}>
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={[
              styles.image,
              shape === "circle" ? styles.circle : styles.square,
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              shape === "circle" ? styles.circle : styles.square,
            ]}
          >
            <Text>{placeholderText}</Text>
          </View>
        )}
      </TouchableOpacity>

      {isUploading && <Text>Uploading...</Text>}
      {isError && !isUploading && (
        <Text style={styles.error}>Upload failed. Try again.</Text>
      )}
      {sizeError && <Text style={styles.error}>{sizeError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 4,
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholder: {
    width: 80,
    height: 80,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    borderRadius: 40,
  },
  square: {
    borderRadius: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
