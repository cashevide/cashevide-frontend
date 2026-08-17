import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StarIcon } from "react-native-heroicons/solid";

import { useReviewSummary } from "../hooks/useReviewSummary";
import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useDeleteMyReview } from "../hooks/useDeleteMyReview";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner, ConfirmDialog } from "@/src/shared/ui";
import type { TagSummaryItem } from "../types/reviewSummaryTypes";

const RATING_VALUES = [5, 4, 3, 2, 1] as const;

export default function ReviewedClientSummaryScreen() {
  const { reviewedClientId } = useLocalSearchParams<{
    reviewedClientId: string;
  }>();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const summary = useReviewSummary(reviewedClientId);
  const myReview = useMyReviewForClient(reviewedClientId);
  const deleteMyReview = useDeleteMyReview();

  function handleDelete() {
    if (!myReview.data?.review) return;

    deleteMyReview.mutate(
      {
        id: myReview.data.review.id,
        clientId: reviewedClientId,
      },
      {
        onSuccess: () => setIsDeleteDialogOpen(false),
      },
    );
  }

  const isLoading = summary.isLoading || myReview.isLoading;
  const hasReviews = (summary.data?.total_reviews ?? 0) > 0;
  const totalReviews = summary.data?.total_reviews ?? 0;

  // Sort tags by count so the most-picked attributes surface first —
  // matches the "scannable at a glance" pattern from review-summary UX
  // research (Amazon/Baymard-style distribution summaries).
  const sortedTags = [...(summary.data?.tags_summary ?? [])].sort(
    (a, b) => b.count - a.count,
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Client Reviews"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-8">
          {isLoading && (
            <View className="items-center py-12">
              <Spinner />
            </View>
          )}

          {!isLoading && summary.data && !hasReviews && (
            <View className="items-center gap-2 py-12">
              <Text variant="subheading" className="text-center">
                No reviews yet
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center"
              >
                Be the first to review this client.
              </Text>
            </View>
          )}

          {!isLoading && summary.data && hasReviews && (
            <>
              {/* Average rating — the single most important number, so it
                  leads the screen at a large size, with the star icon and
                  review count right beside it for immediate context. */}
              <View className="items-center gap-2">
                <View className="flex-row items-end gap-2">
                  <Text variant="display" className="text-5xl leading-none">
                    {summary.data.average_rating.toFixed(1)}
                  </Text>
                  <StarIcon
                    width={28}
                    height={28}
                    color="rgb(var(--color-warning))"
                    style={{ marginBottom: 6 }}
                  />
                </View>
                <Text variant="body-sm" className="text-muted-foreground">
                  Based on {totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"}
                </Text>
              </View>

              {/* Rating distribution — horizontal bars, highest star first.
                  This is the industry-standard pattern (Amazon, app
                  stores) for letting users judge review quality at a
                  glance instead of just trusting one averaged number. */}
              <View className="gap-2">
                {RATING_VALUES.map((star) => {
                  const count =
                    summary.data!.rating_distribution[
                      String(
                        star,
                      ) as keyof typeof summary.data.rating_distribution
                    ];
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <View key={star} className="flex-row items-center gap-3">
                      <Text
                        variant="caption"
                        className="w-3 text-right text-muted-foreground"
                      >
                        {star}
                      </Text>
                      <StarIcon
                        width={12}
                        height={12}
                        color="rgb(var(--color-muted-foreground))"
                      />
                      <View className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <View
                          className="h-full rounded-full bg-warning"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                      <Text
                        variant="caption"
                        className="w-6 text-right text-muted-foreground"
                      >
                        {count}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Tag summary — grouped attribute chips with counts, most
                  frequently picked first. category (POSITIVE/NEGATIVE)
                  drives the color so patterns ("mostly paid on time" vs
                  "frequently delayed") are readable without reading
                  every label. */}
              {sortedTags.length > 0 && (
                <View className="gap-3">
                  <Text variant="overline">What reviewers said</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {sortedTags.map((tag: TagSummaryItem) => {
                      const isPositive = tag.category === "POSITIVE";

                      return (
                        <View
                          key={tag.id}
                          className={cn(
                            "flex-row items-center gap-1.5 rounded-full px-3 py-1.5",
                            isPositive ? "bg-success/15" : "bg-destructive/15",
                          )}
                        >
                          <Text
                            variant="body-sm"
                            className={cn(
                              "font-medium",
                              isPositive
                                ? "text-success-text"
                                : "text-destructive-text",
                            )}
                          >
                            {tag.name}
                          </Text>
                          <Text
                            variant="body-sm"
                            className={cn(
                              "font-semibold",
                              isPositive
                                ? "text-success-text"
                                : "text-destructive-text",
                            )}
                          >
                            {tag.count}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </>
          )}

          {/* My review actions */}
          {!myReview.isLoading && myReview.data && (
            <View className="gap-3 pt-2">
              {!myReview.data.exists ? (
                <View className="items-center">
                  <Button
                    variant="primary"
                    title="Add Review"
                    onPress={() =>
                      router.push(ROUTES.reviews.add(reviewedClientId))
                    }
                  />
                </View>
              ) : (
                <View className="flex-row justify-center gap-3">
                  <Button
                    variant="outline"
                    title="Edit Review"
                    onPress={() =>
                      router.push(ROUTES.reviews.edit(reviewedClientId))
                    }
                  />
                  <Button
                    variant="destructive"
                    title="Delete Review"
                    onPress={() => setIsDeleteDialogOpen(true)}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </Container>

      <ConfirmDialog
        visible={isDeleteDialogOpen}
        title="Delete review?"
        message="This will permanently remove your review for this client. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isConfirming={deleteMyReview.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </View>
  );
}
