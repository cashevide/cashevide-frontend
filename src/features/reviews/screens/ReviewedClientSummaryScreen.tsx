import { Button, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useReviewSummary } from "../hooks/useReviewSummary";
import { useMyReviewForClient } from "../hooks/useMyReviewForClient";
import { useDeleteMyReview } from "../hooks/useDeleteMyReview";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function ReviewedClientSummaryScreen() {
  const { reviewedClientId } = useLocalSearchParams<{
    reviewedClientId: string;
  }>();

  const summary = useReviewSummary(reviewedClientId);
  const myReview = useMyReviewForClient(reviewedClientId);
  const deleteMyReview = useDeleteMyReview();

  const handleDelete = () => {
    if (!myReview.data?.review) return;

    deleteMyReview.mutate({
      id: myReview.data.review.id,
      clientId: reviewedClientId,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Reviewed Client Summary Screen</Text>
      <Text>Client ID: {reviewedClientId}</Text>

      {summary.isLoading && <Text>Loading summary...</Text>}

      {summary.data && summary.data.total_reviews === 0 && (
        <Text>No reviews yet — be the first to give a review!</Text>
      )}

      {summary.data && summary.data.total_reviews > 0 && (
        <View style={styles.summaryBox}>
          <Text>Average Rating: {summary.data.average_rating}</Text>
          <Text>Total Reviews: {summary.data.total_reviews}</Text>
          {summary.data.tags_summary.map((tag) => (
            <Text key={tag.id}>
              [{tag.group}] {tag.name} — {tag.count}
            </Text>
          ))}
        </View>
      )}

      {myReview.isLoading && <Text>Checking your review...</Text>}

      {myReview.data && !myReview.data.exists && (
        <Button
          title="Add Review"
          onPress={() => router.push(ROUTES.reviews.add(reviewedClientId))}
        />
      )}

      {myReview.data && myReview.data.exists && (
        <>
          <Button
            title="Edit Review"
            onPress={() => router.push(ROUTES.reviews.edit(reviewedClientId))}
          />
          <Button
            title="Delete Review"
            onPress={handleDelete}
            color="red"
            disabled={deleteMyReview.isPending}
          />
        </>
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
  summaryBox: {
    gap: 4,
    alignItems: "center",
  },
});
