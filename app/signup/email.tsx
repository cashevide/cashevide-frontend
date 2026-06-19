import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function EmailScreen() {
  return (
    <View style={styles.container}>
      <Text>Email page</Text>
      <Button title="Send OTP" onPress={() => router.push("/signup/otp")} />
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
