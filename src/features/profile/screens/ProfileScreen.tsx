import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ProfileSubTabs from "../components/ProfileSubTabs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";

export default function ProfileScreen() {
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    const uri = result.assets[0].uri;
    setPickedImageUri(uri);

    updateUserProfile.mutate(
      {
        profile_picture: {
          uri,
          name: "profile_picture.jpg",
          type: "image/jpeg",
        },
      },
      {
        onSettled: () => setPickedImageUri(null),
      },
    );
  };

  const displayImageUri = pickedImageUri ?? userProfile.data?.profile_picture;

  return (
    <View style={styles.container}>
      <ProfileSubTabs />

      {userProfile.isLoading && <Text>Loading profile...</Text>}

      {userProfile.data && (
        <View style={styles.profileBox}>
          <TouchableOpacity onPress={handleChangePhoto}>
            {displayImageUri ? (
              <Image source={{ uri: displayImageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {updateUserProfile.isPending && <Text>Updating photo...</Text>}

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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
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
