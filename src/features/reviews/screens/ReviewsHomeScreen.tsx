import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useCreateReviewedClient } from "../hooks/useCreateReviewedClient";
import { ROUTES } from "@/src/shared/navigation/routes";

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

      <TextInput
        style={styles.input}
        placeholder="+919XXXXXXXXX"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

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
});
