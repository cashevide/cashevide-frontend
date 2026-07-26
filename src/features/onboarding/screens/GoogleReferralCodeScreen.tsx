import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  return (
    <View style={styles.container}>
      <Text>Google Referral Code Screen</Text>

      <TextInput
        value={referralCode}
        onChangeText={(text) => setReferralCode(text.toUpperCase())}
        placeholder="Referral Code"
        autoCapitalize="characters"
        style={styles.input}
      />

      {referralCheck.isFetching ? <ActivityIndicator /> : null}

      {referralCheck.data ? (
        <Text
          style={referralCheck.data.is_valid ? styles.success : styles.error}
        >
          {referralCheck.data.message}
        </Text>
      ) : null}

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!canContinue}
      />

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
  },
  input: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
});
