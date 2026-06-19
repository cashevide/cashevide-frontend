import { router } from "expo-router";
import { Text, View, Button, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text> Welcome</Text>

      <Button
        title="Continue with Google"
        onPress={() => router.push("/signup/google")}
      />

      <Button
        title="Continue with Email"
        onPress={() => router.push("/signup/referral")}
      />

      <Button title="Login" onPress={() => router.push("/login")} />
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
