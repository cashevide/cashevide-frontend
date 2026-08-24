import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, StarRating } from "@/src/shared/ui";

export default function DesignStarRating() {
  const [rating, setRating] = useState<number | null>(null);
  const [prefilledRating, setPrefilledRating] = useState<number | null>(4);

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Star Rating</Text>

        {/* Interactive */}
        <View className="gap-3">
          <Text variant="heading">Interactive</Text>

          <View className="flex-row flex-wrap items-start gap-10">
            <View className="items-start gap-2">
              <Text variant="caption" className="text-muted-foreground">
                No selection (null)
              </Text>
              <StarRating value={rating} onChange={setRating} size={36} />
            </View>

            <View className="items-start gap-2">
              <Text variant="caption" className="text-muted-foreground">
                Pre-selected
              </Text>
              <StarRating
                value={prefilledRating}
                onChange={setPrefilledRating}
                size={36}
              />
            </View>
          </View>
        </View>

        {/* Sizes */}
        <View className="gap-3">
          <Text variant="heading">Sizes</Text>

          <View className="flex-row flex-wrap items-center gap-10">
            <View className="items-center gap-2">
              <StarRating value={4} onChange={() => {}} size={20} />
              <Text variant="caption" className="text-muted-foreground">
                size 20
              </Text>
            </View>

            <View className="items-center gap-2">
              <StarRating value={4} onChange={() => {}} size={32} />
              <Text variant="caption" className="text-muted-foreground">
                size 32 (default)
              </Text>
            </View>

            <View className="items-center gap-2">
              <StarRating value={4} onChange={() => {}} size={44} />
              <Text variant="caption" className="text-muted-foreground">
                size 44
              </Text>
            </View>
          </View>
        </View>

        {/* Custom max */}
        <View className="gap-3">
          <Text variant="heading">Custom Max</Text>

          <View className="items-start">
            <StarRating value={7} onChange={() => {}} max={10} size={28} />
          </View>
        </View>
      </View>
    </Container>
  );
}
