import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, CurrencyPicker } from "@/src/shared/ui";

export default function DesignCurrencyPicker() {
  const [currency, setCurrency] = useState("");
  const [prefilledCurrency, setPrefilledCurrency] = useState("USD");

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Currency Picker</Text>

        {/* Interactive */}
        <View className="gap-6">
          <Text variant="heading">Interactive</Text>

          <View className="flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <View className="gap-1.5 w-[240px]">
              <Text variant="caption" className="text-muted-foreground">
                Empty
              </Text>
              <CurrencyPicker value={currency} onChange={setCurrency} />
            </View>

            <View className="gap-1.5 w-[240px]">
              <Text variant="caption" className="text-muted-foreground">
                Pre-selected
              </Text>
              <CurrencyPicker
                value={prefilledCurrency}
                onChange={setPrefilledCurrency}
              />
            </View>
          </View>
        </View>

        {/* Custom placeholder */}
        <View className="gap-6">
          <Text variant="heading">Custom Placeholder</Text>

          <View className="items-start pt-5">
            <View className="gap-1.5 w-[240px]">
              <CurrencyPicker
                value=""
                onChange={() => {}}
                placeholder="Choose invoice currency"
              />
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
