import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCheckReferralCode } from "../hooks/useCheckReferralCode";
import { useSignupStore } from "@/src/store/signupStore";

const TELEGRAM_BOT_URL = "https://t.me/CashevideAssistantBot";

export default function ReferralCodeScreen() {
  const [referralCode, setReferralCode] = useState("");

  const setReferralCodeInput = useSignupStore(
    (state) => state.setReferralCodeInput,
  );

  const referralCheck = useCheckReferralCode(referralCode);

  function handleContinue() {
    setReferralCodeInput(referralCode.trim());
    router.push("/signup/email");
  }

  function handleGetReferralCode() {
    Linking.openURL(TELEGRAM_BOT_URL);
  }

  const canContinue = referralCheck.data?.is_valid === true;

  return (
    <View style={styles.container}>
      <Text>Referral Code Screen</Text>

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

      <Pressable onPress={handleGetReferralCode}>
        <Text style={styles.link}>
          Don't have a referral code? Get one via Telegram
        </Text>
      </Pressable>

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
  link: {
    color: "blue",
    textAlign: "center",
  },
});
