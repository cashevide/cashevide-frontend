import { useMemo, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCreateReviewedClient } from "../hooks/useCreateReviewedClient";
import { useReviewTags } from "../hooks/useReviewTags";
import { useCreateReview } from "../hooks/useCreateReview";
import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useTagSelection } from "@/src/shared/hooks/useTagSelection";
import { ROUTES } from "@/src/shared/navigation/routes";
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

  const handleFindClient = () => {
    createReviewedClient.mutate(
      { phone_number: phoneNumber },
      {
        onSuccess: (data) => setClientId(data.id),
      },
    );
  };

  const handleSubmitReview = () => {
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
  };

  // Step 1: no client yet — ask for phone number
  if (!clientId) {
    return (
      <View style={styles.container}>
        <Text>Add Review — Step 1: Find Client</Text>

        <TextInput
          style={styles.input}
          placeholder="+919XXXXXXXXX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Button
          title="Give Review"
          onPress={handleFindClient}
          disabled={createReviewedClient.isPending}
        />

        {createReviewedClient.isError && (
          <Text style={styles.error}>
            {JSON.stringify(
              (createReviewedClient.error as any)?.response?.data ??
                createReviewedClient.error.message,
            )}
          </Text>
        )}

        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  // Client known, checking if already reviewed
  if (myReview.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Checking existing review...</Text>
      </View>
    );
  }

  // Already reviewed — don't show tags/rating form, redirect to summary
  if (myReview.data?.exists) {
    return (
      <View style={styles.container}>
        <Text>You have already reviewed this client.</Text>
        <Button
          title="Go to Summary"
          onPress={() => router.replace(ROUTES.reviews.summary(clientId))}
        />
      </View>
    );
  }

  // Step 2: client known, no existing review — tags + rating
  return (
    <View style={styles.container}>
      <Text>Add Review — Step 2: Tags & Rating</Text>

      {reviewTags.isLoading && <Text>Loading tags...</Text>}

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
        title="Add Review"
        onPress={handleSubmitReview}
        disabled={createReview.isPending || selectedTagIds.length === 0}
      />

      {createReview.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (createReview.error as any)?.response?.data ??
              createReview.error.message,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "80%",
    borderRadius: 4,
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
