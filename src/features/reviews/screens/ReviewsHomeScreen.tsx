import { useState } from "react";
import { Platform, View } from "react-native";
import { router } from "expo-router";

import { useCreateReviewedClient } from "../hooks/useCreateReviewedClient";
import { ROUTES } from "@/src/shared/navigation/routes";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, PhoneNumberInput } from "@/src/shared/ui";

export default function ReviewsHomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );
  const createReviewedClient = useCreateReviewedClient();

  function handleFindClient() {
    if (!phoneNumber.trim()) {
      setValidationError("Enter a phone number to continue.");
      return;
    }

    setValidationError(undefined);
    createReviewedClient.mutate(
      { phone_number: phoneNumber },
      {
        onSuccess: (data) => {
          router.push(ROUTES.reviews.summary(data.id));
        },
      },
    );
  }

  const errorMessage =
    validationError ??
    (createReviewedClient.isError
      ? getFieldErrorMessage(createReviewedClient.error)
      : undefined);

  const content = (
    <View className="flex-1 py-10">
      <View className="w-full max-w-narrow mx-auto">
        <View className="px-6 gap-8">
          <Text variant="subheading" className="text-center">
            Find a client
          </Text>

          <View className="gap-4">
            <PhoneNumberInput
              onChangeFullNumber={(value) => {
                setPhoneNumber(value);
                if (validationError) setValidationError(undefined);
              }}
            />

            <View className="items-center">
              <Button
                variant="primary"
                title="Continue"
                onPress={handleFindClient}
                isLoading={createReviewedClient.isPending}
              />
            </View>

            {errorMessage && (
              <Text variant="body-sm" className="text-destructive text-center">
                {errorMessage}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Reviews" containerVariant="desktop" />

      {Platform.OS === "web" ? (
        <Container variant="desktop" safeArea="bottom" scroll>
          {content}
        </Container>
      ) : (
        <Container variant="desktop" safeArea="bottom">
          {content}
        </Container>
      )}
    </View>
  );
}
