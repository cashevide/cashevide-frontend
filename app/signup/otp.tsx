import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";
export default function OTPPage() {
  return (
    <View style={styles.container}>
      <Text>OTPPage</Text>
      <Button
        title="Verify OTP"
        onPress={() => router.push("/signup/account")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
