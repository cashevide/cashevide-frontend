import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Input } from "@/src/shared/ui";

export default function DesignInputs() {
  const [password, setPassword] = useState("");

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-6">
        <Text variant="title">Inputs</Text>

        <View className="gap-6 max-w-[400px]">
          <Input label="Default" placeholder="Enter your name" />

          <Input
            label="With Error"
            placeholder="Enter your email"
            error="Please enter a valid email address"
          />

          <Input
            label="Success"
            placeholder="Username"
            isSuccess
            defaultValue="noufal_k"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <Input label="Disabled" placeholder="Cannot edit this" disabled />
        </View>
      </View>
    </Container>
  );
}
