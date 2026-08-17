import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useReviewTags } from "../hooks/useReviewTags";
import { useUpdateMyReview } from "../hooks/useUpdateMyReview";
import { useTagSelection } from "@/src/shared/hooks/useTagSelection";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner, StarRating } from "@/src/shared/ui";
import type { Tag } from "../types/tagTypes";

export default function EditReviewScreen() {
  const { reviewedClientId } = useLocalSearchParams<{
    reviewedClientId: string;
  }>();

  const myReview = useMyReviewForClient(reviewedClientId);
  const reviewTags = useReviewTags();
  const updateMyReview = useUpdateMyReview();

  const { selectedTagIds, setSelectedTagIds, toggleTag } = useTagSelection(
    reviewTags.data,
  );
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (myReview.data?.review) {
      setSelectedTagIds(myReview.data.review.tags);
      setRating(myReview.data.review.ratings);
    }
  }, [myReview.data, setSelectedTagIds]);

  const tagsByGroup = useMemo(() => {
    if (!reviewTags.data) return {};
    return reviewTags.data.reduce<Record<string, Tag[]>>((acc, tag) => {
      if (!acc[tag.group]) acc[tag.group] = [];
      acc[tag.group].push(tag);
      return acc;
    }, {});
  }, [reviewTags.data]);

  const errorMessage = updateMyReview.isError
    ? getFieldErrorMessage(updateMyReview.error)
    : null;

  function handleSave() {
    if (!myReview.data?.review) return;

    updateMyReview.mutate(
      {
        id: myReview.data.review.id,
        payload: {
          tags: selectedTagIds,
          ratings: rating,
        },
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.reviews.summary(reviewedClientId));
        },
      },
    );
  }

  if (myReview.isLoading || reviewTags.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Review"
          showBackButton
          containerVariant="narrow"
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Edit Review"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-8">
          <View className="items-center gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              How was your experience?
            </Text>
            <StarRating value={rating} onChange={setRating} size={36} />
          </View>

          {Object.entries(tagsByGroup).map(([group, tags]) => (
            <View key={group} className="gap-3">
              <Text variant="overline">{group}</Text>
              <View className="flex-row flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  const isPositive = tag.category === "POSITIVE";

                  return (
                    <Button
                      key={tag.id}
                      title={tag.name}
                      size="sm"
                      variant={
                        isSelected
                          ? isPositive
                            ? "success"
                            : "destructive"
                          : "outline"
                      }
                      onPress={() => toggleTag(tag)}
                      className={cn("min-w-0 rounded-full px-4 h-9")}
                    />
                  );
                })}
              </View>
            </View>
          ))}

          <View className="gap-4">
            <View className="items-center">
              <Button
                variant="primary"
                title="Save Changes"
                onPress={handleSave}
                disabled={
                  updateMyReview.isPending || selectedTagIds.length === 0
                }
                isLoading={updateMyReview.isPending}
              />
            </View>

            {errorMessage && (
              <Text variant="body-sm" className="text-destructive text-center">
                {errorMessage}
              </Text>
            )}
          </View>
        </View>
      </Container>
    </View>
  );
}
