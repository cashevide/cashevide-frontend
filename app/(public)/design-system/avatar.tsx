import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Avatar } from "@/src/shared/ui";

export default function DesignAvatar() {
  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-10">
        <Text variant="title">Avatar</Text>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Falls back in order: image → first letter of name → generic icon.
            Used for the profile tab and anywhere a person/business needs a
            picture.
          </Text>

          <View className="flex-row items-center gap-6">
            <View className="items-center gap-2">
              <Avatar imageUri="https://i.pravatar.cc/150?img=12" size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                Image
              </Text>
            </View>

            <View className="items-center gap-2">
              <Avatar name="Noufal Kadalur" size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                Initial
              </Text>
            </View>

            <View className="items-center gap-2">
              <Avatar size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                No image, no name
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Sizes
          </Text>
          <View className="flex-row items-end gap-4">
            <Avatar name="Noufal Kadalur" size={20} />
            <Avatar name="Noufal Kadalur" size={32} />
            <Avatar name="Noufal Kadalur" size={48} />
            <Avatar name="Noufal Kadalur" size={72} />
          </View>
        </View>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Shape — circle (people) vs square (businesses/logos)
          </Text>
          <View className="flex-row items-center gap-6">
            <Avatar name="Cashevide" shape="circle" size={56} />
            <Avatar name="Cashevide" shape="square" size={56} />
            <Avatar
              imageUri="https://i.pravatar.cc/150?img=33"
              shape="square"
              size={56}
            />
          </View>
        </View>
      </View>
    </Container>
  );
}
