import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, AvatarPicker } from "@/src/shared/ui";

export default function DesignAvatarPicker() {
  const [circleImageUri, setCircleImageUri] = useState<string | null>(
    "https://i.pravatar.cc/150?img=12",
  );
  const [squareImageUri, setSquareImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Avatar Picker</Text>

        {/* Interactive */}
        <View className="gap-6">
          <Text variant="heading">Interactive</Text>

          <View className="flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <View className="items-center gap-3">
              <AvatarPicker
                imageUri={circleImageUri}
                onPick={(asset) => setCircleImageUri(asset.uri)}
                onRemove={() => setCircleImageUri(null)}
                shape="circle"
              />
              <Text variant="caption" className="text-muted-foreground">
                Circle, with image
              </Text>
            </View>

            <View className="items-center gap-3">
              <AvatarPicker
                imageUri={squareImageUri}
                onPick={(asset) => setSquareImageUri(asset.uri)}
                onRemove={() => setSquareImageUri(null)}
                shape="square"
                placeholderText="Add Logo"
              />
              <Text variant="caption" className="text-muted-foreground">
                Square, empty
              </Text>
            </View>
          </View>
        </View>

        {/* Upload states */}
        <View className="gap-6">
          <Text variant="heading">Upload States</Text>

          <View className="flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <View className="items-center gap-3">
              <AvatarPicker
                imageUri={null}
                onPick={() => {}}
                isUploading={isUploading}
              />
              <Button
                title="Toggle uploading"
                size="sm"
                variant="outline"
                onPress={() => setIsUploading((prev) => !prev)}
              />
            </View>

            <View className="items-center gap-3">
              <AvatarPicker imageUri={null} onPick={() => {}} isError />
              <Text variant="caption" className="text-muted-foreground">
                isError
              </Text>
            </View>
          </View>
        </View>

        {/* Sizes */}
        <View className="gap-6">
          <Text variant="heading">Sizes</Text>

          <View className="flex-row flex-wrap items-end gap-10 pt-5 pb-14 border-b border-border">
            <View className="items-center gap-3">
              <AvatarPicker
                imageUri="https://i.pravatar.cc/150?img=5"
                onPick={() => {}}
              />
              <Text variant="caption" className="text-muted-foreground">
                Default (80px)
              </Text>
            </View>

            <View className="items-center gap-3">
              <AvatarPicker
                imageUri="https://i.pravatar.cc/150?img=8"
                onPick={() => {}}
                size={112}
              />
              <Text variant="caption" className="text-muted-foreground">
                size=112 — used on Personal Profile
              </Text>
            </View>
          </View>
        </View>

        {/* No remove handler */}
        <View className="gap-6">
          <Text variant="heading">Without Remove</Text>

          <View className="items-start pt-5">
            <AvatarPicker
              imageUri="https://i.pravatar.cc/150?img=33"
              onPick={() => {}}
            />
          </View>
        </View>
      </View>
    </Container>
  );
}
