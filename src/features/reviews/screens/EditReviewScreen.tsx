import { useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useReviewTags } from "../hooks/useReviewTags";
import { useUpdateMyReview } from "../hooks/useUpdateMyReview";
import { useTagSelection } from "@/src/shared/hooks/useTagSelection";
import { ROUTES } from "@/src/shared/navigation/routes";
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

  const handleSave = () => {
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
  };

  if (myReview.isLoading || reviewTags.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading review...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Edit Review Screen</Text>
      <Text>Client ID: {reviewedClientId}</Text>

      {Object.entries(tagsByGroup).map(([group, tags]) => (
        <View key={group} style={styles.group}>
          <Text style={styles.groupTitle}>{group}</Text>
          <View style={styles.tagRow}>
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                >
                  <Text>{tag.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Rating</Text>
        <View style={styles.tagRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setRating(value)}
              style={[
                styles.tagChip,
                rating === value && styles.tagChipSelected,
              ]}
            >
              <Text>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        title="Save"
        onPress={handleSave}
        disabled={updateMyReview.isPending || selectedTagIds.length === 0}
      />

      {updateMyReview.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (updateMyReview.error as any)?.response?.data ??
              updateMyReview.error.message,
          )}
        </Text>
      )}

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  error: {
    color: "red",
    paddingHorizontal: 16,
    textAlign: "center",
  },
  group: {
    width: "100%",
    gap: 6,
  },
  groupTitle: {
    fontWeight: "bold",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagChipSelected: {
    backgroundColor: "#cce5ff",
    borderColor: "#3399ff",
  },
});
