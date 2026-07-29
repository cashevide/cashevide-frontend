import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { AvatarPicker } from "@/src/shared/ui";
import ProfileSubTabs from "../components/ProfileSubTabs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";

export default function ProfileScreen() {
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  return (
    <View style={styles.container}>
      <ProfileSubTabs />

      {userProfile.isLoading && <Text>Loading profile...</Text>}

      {userProfile.data && (
        <View style={styles.profileBox}>
          <AvatarPicker
            imageUri={userProfile.data.profile_picture}
            onPick={(asset) => {
              updateUserProfile.mutate({ profile_picture: asset });
            }}
            isUploading={updateUserProfile.isPending}
            isError={updateUserProfile.isError}
            shape="circle"
            placeholderText="Add Photo"
            fileName="profile_picture.jpg"
          />

          <Text style={styles.name}>{userProfile.data.full_name}</Text>

          <Button
            title="Edit Personal Profile"
            onPress={() => router.push("/profile/edit")}
          />

          <Text>{userProfile.data.email}</Text>
          {userProfile.data.job_title ? (
            <Text>{userProfile.data.job_title}</Text>
          ) : null}
          {userProfile.data.phone_number ? (
            <Text>{userProfile.data.phone_number}</Text>
          ) : null}
          <Text style={styles.credits}>
            {userProfile.data.credit_points} credit points
          </Text>
        </View>
      )}
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
  profileBox: {
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  credits: {
    color: "#666",
    marginTop: 4,
  },
});
