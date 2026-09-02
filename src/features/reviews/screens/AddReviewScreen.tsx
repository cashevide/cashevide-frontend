import { useMemo, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useCreateReviewedClient } from "../hooks/useCreateReviewedClient";
import { useReviewTags } from "../hooks/useReviewTags";
import { useCreateReview } from "../hooks/useCreateReview";
import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useTagSelection } from "@/src/shared/hooks/useTagSelection";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  Spinner,
  PhoneNumberInput,
  StarRating,
} from "@/src/shared/ui";
import type { Tag } from "../types/tagTypes";

export default function AddReviewScreen() {
  const { clientId: clientIdParam } = useLocalSearchParams<{
    clientId?: string;
  }>();

  const [clientId, setClientId] = useState<string | null>(
    clientIdParam ?? null,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const createReviewedClient = useCreateReviewedClient();
  const reviewTags = useReviewTags();
  const createReview = useCreateReview();
  const myReview = useMyReviewForClient(clientId ?? "");

  const { selectedTagIds, toggleTag } = useTagSelection(reviewTags.data);

  const tagsByGroup = useMemo(() => {
    if (!reviewTags.data) return {};
    return reviewTags.data.reduce<Record<string, Tag[]>>((acc, tag) => {
      if (!acc[tag.group]) acc[tag.group] = [];
      acc[tag.group].push(tag);
      return acc;
    }, {});
  }, [reviewTags.data]);

  const findClientErrorMessage = createReviewedClient.isError
    ? getFieldErrorMessage(createReviewedClient.error)
    : null;

  const submitReviewErrorMessage = createReview.isError
    ? getFieldErrorMessage(createReview.error)
    : null;

  function handleFindClient() {
    createReviewedClient.mutate(
      { phone_number: phoneNumber },
      {
        onSuccess: (data) => setClientId(data.id),
      },
    );
  }

  function handleSubmitReview() {
    if (!clientId) return;

    createReview.mutate(
      {
        clientId,
        payload: {
          tags: selectedTagIds,
          ratings: rating,
        },
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.reviews.summary(clientId));
        },
      },
    );
  }

  // Step 1: no client yet — ask for phone number
  if (!clientId) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Add Review"
          showBackButton
          containerVariant="narrow"
        />

        <Container variant="narrow" safeArea="bottom" scroll>
          <View className="flex-1 px-6 py-10 gap-8">
            <View className="gap-2">
              <Text variant="subheading" className="text-center">
                Find a client
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center"
              >
                Enter the client&apos;s phone number to start a review.
              </Text>
            </View>

            <View className="gap-4">
              <PhoneNumberInput onChangeFullNumber={setPhoneNumber} />

              <View className="items-center">
                <Button
                  variant="primary"
                  title="Continue"
                  onPress={handleFindClient}
                  disabled={!phoneNumber.trim()}
                  isLoading={createReviewedClient.isPending}
                />
              </View>

              {findClientErrorMessage && (
                <Text
                  variant="body-sm"
                  className="text-destructive text-center"
                >
                  {findClientErrorMessage}
                </Text>
              )}
            </View>
          </View>
        </Container>
      </View>
    );
  }

  // Client known, checking if already reviewed
  if (myReview.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Add Review"
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

  // Already reviewed — don't show tags/rating form, redirect to summary
  if (myReview.data?.exists) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Add Review"
          showBackButton
          containerVariant="narrow"
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center px-6 gap-6">
            <Text variant="body" className="text-center">
              You have already reviewed this client.
            </Text>
            <Button
              variant="primary"
              title="Go to Summary"
              onPress={() => router.replace(ROUTES.reviews.summary(clientId))}
            />
          </View>
        </Container>
      </View>
    );
  }

  // Step 2: client known, no existing review — tags + rating
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Rate & Review"
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

          {reviewTags.isLoading && (
            <View className="items-center py-4">
              <Spinner />
            </View>
          )}

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
                title="Submit Review"
                onPress={handleSubmitReview}
                disabled={createReview.isPending || selectedTagIds.length === 0}
                isLoading={createReview.isPending}
              />
            </View>

            {submitReviewErrorMessage && (
              <Text variant="body-sm" className="text-destructive text-center">
                {submitReviewErrorMessage}
              </Text>
            )}
          </View>
        </View>
      </Container>
    </View>
  );
}
