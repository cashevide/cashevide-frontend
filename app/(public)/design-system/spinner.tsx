import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Spinner } from "@/src/shared/ui";

export default function DesignSpinner() {
  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Spinner</Text>

        {/* Sizes */}
        <View className="gap-6">
          <Text variant="heading">Sizes</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            Wraps React Native's ActivityIndicator, which only supports two
            native sizes. "sm" and "default" both render as "small" — "lg" is
            the only visually distinct size.
          </Text>

          <View className="flex-row flex-wrap items-end gap-10 border-b border-border py-5">
            <View className="items-center gap-3">
              <Spinner size="sm" />
              <Text variant="caption" className="text-muted-foreground">
                sm
              </Text>
            </View>

            <View className="items-center gap-3">
              <Spinner size="default" />
              <Text variant="caption" className="text-muted-foreground">
                default
              </Text>
            </View>

            <View className="items-center gap-3">
              <Spinner size="lg" />
              <Text variant="caption" className="text-muted-foreground">
                lg
              </Text>
            </View>
          </View>
        </View>

        {/* Custom color */}
        <View className="gap-6">
          <Text variant="heading">Custom Color</Text>

          <View className="flex-row flex-wrap items-center gap-10 border-b border-border py-5">
            <View className="items-center gap-3">
              <Spinner size="lg" color="rgb(var(--color-primary))" />
              <Text variant="caption" className="text-muted-foreground">
                Primary
              </Text>
            </View>

            <View className="items-center gap-3">
              <Spinner size="lg" color="rgb(var(--color-destructive))" />
              <Text variant="caption" className="text-muted-foreground">
                Destructive
              </Text>
            </View>
          </View>
        </View>

        {/* In context */}
        <View className="gap-6">
          <Text variant="heading">In Context</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            Common placement — inline with text while a request is in flight.
          </Text>

          <View className="flex-row items-center gap-2 py-5">
            <Spinner size="sm" />
            <Text variant="body-sm" className="text-muted-foreground">
              Loading...
            </Text>
          </View>
        </View>
      </View>
    </Container>
  );
}
