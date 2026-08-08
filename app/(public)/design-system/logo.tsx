import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Logo } from "@/src/shared/ui";

export default function DesignLogo() {
  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-6">
        <Text variant="title">Logo</Text>

        <View className="flex-row flex-wrap items-end gap-8 border-b border-border py-5">
          <View className="items-center gap-2">
            <Logo width={40} />
            <Text variant="caption" className="text-muted-foreground">
              40px
            </Text>
          </View>

          <View className="items-center gap-2">
            <Logo width={80} />
            <Text variant="caption" className="text-muted-foreground">
              80px
            </Text>
          </View>

          <View className="items-center gap-2">
            <Logo width={120} />
            <Text variant="caption" className="text-muted-foreground">
              120px
            </Text>
          </View>
        </View>
      </View>
    </Container>
  );
}
