import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input, Spinner } from "@/src/shared/ui";
import { useCheckReferralCode } from "../hooks/useCheckReferralCode";
import { useGoogleAuthStore } from "@/src/store/googleAuthStore";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function GoogleReferralCodeScreen() {
  const [referralCode, setReferralCode] = useState("");

  const setReferralCodeInput = useGoogleAuthStore(
    (state) => state.setReferralCodeInput,
  );

  const referralCheck = useCheckReferralCode(referralCode);

  function handleContinue() {
    setReferralCodeInput(referralCode.trim());
    router.push(ROUTES.signup.google.username);
  }

  const canContinue = referralCheck.data?.is_valid === true;

  const referralCheckMessage = referralCheck.data
    ? {
        text: referralCheck.data.message,
        isSuccess: referralCheck.data.is_valid,
      }
    : null;

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Enter your referral code
      </Text>

      <View className="gap-4">
        <View className="gap-2">
          <Input
            value={referralCode}
            onChangeText={(text) => setReferralCode(text.toUpperCase())}
            placeholder="Referral Code"
            autoCapitalize="characters"
            isSuccess={referralCheckMessage?.isSuccess}
            error={
              referralCheckMessage && !referralCheckMessage.isSuccess
                ? referralCheckMessage.text
                : undefined
            }
          />

          {referralCheck.isFetching ? (
            <View className="items-center">
              <Spinner size="sm" />
            </View>
          ) : null}

          {referralCheckMessage?.isSuccess ? (
            <Text variant="body-sm" className="text-success-text text-center">
              {referralCheckMessage.text}
            </Text>
          ) : null}
        </View>

        <View className="items-center">
          <Button
            variant="primary"
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
          />
        </View>
      </View>
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <Container variant="narrow" safeArea scroll>
        {content}
      </Container>
    );
  }

  return (
    <Container variant="narrow" safeArea>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </Container>
  );
}
