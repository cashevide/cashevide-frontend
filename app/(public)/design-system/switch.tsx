import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Switch } from "@/src/shared/ui";

export default function DesignSwitch() {
  const [interactiveValue, setInteractiveValue] = useState(true);

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Switch</Text>

        {/* States */}
        <View className="gap-6">
          <Text variant="heading">States</Text>

          <View className="flex-row flex-wrap gap-10 border-b border-border py-5">
            <View className="items-center gap-3">
              <Switch value={true} onValueChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Enabled
              </Text>
            </View>

            <View className="items-center gap-3">
              <Switch value={false} onValueChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Disabled
              </Text>
            </View>

            <View className="items-center gap-3">
              <Switch value={true} onValueChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Enabled + Disabled state
              </Text>
            </View>

            <View className="items-center gap-3">
              <Switch value={false} onValueChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Disabled + Disabled state
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive */}
        <View className="gap-6">
          <Text variant="heading">Interactive</Text>

          <View className="flex-row items-center gap-4 border-b border-border py-5">
            <Switch
              value={interactiveValue}
              onValueChange={setInteractiveValue}
              accessibilityLabel="Toggle example"
            />
            <Text variant="body-sm" className="text-muted-foreground">
              {interactiveValue ? "On" : "Off"}
            </Text>
          </View>
        </View>

        {/* With label */}
        <View className="gap-6">
          <Text variant="heading">With Label</Text>

          <View className="gap-4 max-w-[400px] py-5">
            <View className="flex-row items-center justify-between">
              <Text variant="body">Push notifications</Text>
              <Switch value={true} onValueChange={() => {}} />
            </View>

            <View className="flex-row items-center justify-between">
              <Text variant="body">Email updates</Text>
              <Switch value={false} onValueChange={() => {}} />
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
