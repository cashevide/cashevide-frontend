import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";

export default function EditProfileScreen() {
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (userProfile.data) {
      setFullName(userProfile.data.full_name);
      setPhoneNumber(userProfile.data.phone_number);
      setJobTitle(userProfile.data.job_title);
    }
  }, [userProfile.data]);

  const handleSave = () => {
    updateUserProfile.mutate(
      {
        full_name: fullName,
        phone_number: phoneNumber,
        job_title: jobTitle,
      },
      {
        onSuccess: () => {
          router.replace("/profile");
        },
      },
    );
  };

  if (userProfile.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Edit Personal Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={jobTitle}
        onChangeText={setJobTitle}
      />

      <Button
        title="Save"
        onPress={handleSave}
        disabled={updateUserProfile.isPending || !fullName}
      />

      {updateUserProfile.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (updateUserProfile.error as any)?.response?.data ??
              updateUserProfile.error.message,
          )}
        </Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    width: "80%",
  },
  error: {
    color: "red",
    paddingHorizontal: 16,
    textAlign: "center",
  },
});
