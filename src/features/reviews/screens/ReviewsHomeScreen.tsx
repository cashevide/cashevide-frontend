import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useCreateReviewedClient } from "../hooks/useCreateReviewedClient";
import { ROUTES } from "@/src/shared/navigation/routes";
import { PhoneNumberInput } from "@/src/shared/ui";

export default function ReviewsHomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const createReviewedClient = useCreateReviewedClient();

  const handleSearch = () => {
    createReviewedClient.mutate(
      { phone_number: phoneNumber },
      {
        onSuccess: (data) => {
          router.push(ROUTES.reviews.summary(data.id));
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text>Reviews Home Screen</Text>

      <PhoneNumberInput onChangeFullNumber={setPhoneNumber} />

      <Button
        title="Continue"
        onPress={handleSearch}
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

      <Button
        title="+ Add Review"
        onPress={() => router.push(ROUTES.reviews.add())}
      />
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
});
