import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useReviewTags } from "../hooks/useReviewTags";
import { useUpdateMyReview } from "../hooks/useUpdateMyReview";
import { useTagSelection } from "@/src/shared/hooks/useTagSelection";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  Spinner,
  StarRating,
  SegmentedTabs,
} from "@/src/shared/ui";
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
          containerVariant="desktop"
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
        containerVariant="desktop"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-8">
          <View className="items-center gap-3 mb-4">
            <Text variant="body-sm" className="text-muted-foreground">
              How was your experience? (optional)
            </Text>
            <StarRating value={rating} onChange={setRating} size={36} />
          </View>

          {Object.entries(tagsByGroup).map(([group, tags]) => {
            const activeTagId =
              tags.find((tag) => selectedTagIds.includes(tag.id))?.id ?? null;

            return (
              <View key={group} className="items-center gap-3">
                <Text variant="overline">{group}</Text>
                <SegmentedTabs
                  items={tags.map((tag) => ({
                    key: String(tag.id),
                    label: tag.name,
                  }))}
                  activeKey={activeTagId !== null ? String(activeTagId) : null}
                  onSelect={(key) => {
                    const tag = tags.find((t) => String(t.id) === key);
                    if (tag) toggleTag(tag);
                  }}
                  centered
                />
              </View>
            );
          })}

          <View className="gap-4">
            <View className="items-center gap-2">
              <Button
                variant="primary"
                title="Save Changes"
                onPress={handleSave}
                disabled={
                  updateMyReview.isPending || selectedTagIds.length === 0
                }
                isLoading={updateMyReview.isPending}
              />

              {selectedTagIds.length === 0 && (
                <Text variant="caption" className="text-muted-foreground">
                  Select at least one tag to continue
                </Text>
              )}
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
