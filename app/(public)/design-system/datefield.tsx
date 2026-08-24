import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, DateField } from "@/src/shared/ui";

export default function DesignDateField() {
  const [date, setDate] = useState<string | undefined>(undefined);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(
    "2026-03-15",
  );

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Date Field</Text>

        <Text variant="body-sm" className="text-muted-foreground max-w-[640px]">
          Renders a native HTML date input on web, and the platform date picker
          dialog on iOS/Android. Not a custom-styled calendar.
        </Text>

        {/* Interactive */}
        <View className="gap-6">
          <Text variant="heading">Interactive</Text>

          <View className="flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <View className="w-[240px]">
              <DateField
                label="Payment Date"
                value={date}
                onChange={setDate}
                placeholder="Select date"
              />
            </View>

            <View className="w-[240px]">
              <DateField
                label="Issue Date"
                value={prefilledDate}
                onChange={setPrefilledDate}
              />
            </View>
          </View>
        </View>

        {/* Date range (as used in invoice filters) */}
        <View className="gap-6">
          <Text variant="heading">Date Range</Text>

          <View className="items-start pt-5">
            <View className="flex-row gap-3 w-[300px]">
              <DateField label="From" value={undefined} onChange={() => {}} />
              <DateField label="To" value={undefined} onChange={() => {}} />
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
