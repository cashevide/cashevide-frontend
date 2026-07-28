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
import ProfileSubTabs from "@/src/features/profile/components/ProfileSubTabs";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";

export default function BusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();
  const [pickedLogoUri, setPickedLogoUri] = useState<string | null>(null);

  const handleChangeLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    const uri = result.assets[0].uri;
    setPickedLogoUri(uri);

    updateBusinessProfile.mutate(
      {
        logo: {
          uri,
          name: "logo.jpg",
          type: "image/jpeg",
        },
      },
      {
        onSettled: () => setPickedLogoUri(null),
      },
    );
  };

  const displayLogoUri = pickedLogoUri ?? businessProfile.data?.logo;

  return (
    <View style={styles.container}>
      <ProfileSubTabs />

      {businessProfile.isLoading && <Text>Loading business profile...</Text>}

      {businessProfile.data && (
        <View style={styles.profileBox}>
          <TouchableOpacity onPress={handleChangeLogo}>
            {displayLogoUri ? (
              <Image source={{ uri: displayLogoUri }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text>Add Logo</Text>
              </View>
            )}
          </TouchableOpacity>

          {updateBusinessProfile.isPending && <Text>Updating logo...</Text>}

          <Text style={styles.name}>
            {businessProfile.data.business_name || "Business name not set"}
          </Text>

          <Button
            title="Edit Business Profile"
            onPress={() => router.push("/profile/business-edit")}
          />

          {businessProfile.data.address ? (
            <Text>{businessProfile.data.address}</Text>
          ) : null}
          {businessProfile.data.phone_number ? (
            <Text>{businessProfile.data.phone_number}</Text>
          ) : null}
          {businessProfile.data.website ? (
            <Text>{businessProfile.data.website}</Text>
          ) : null}
          {businessProfile.data.currency ? (
            <Text>Currency: {businessProfile.data.currency}</Text>
          ) : null}
          {businessProfile.data.gst_number ? (
            <Text>GST: {businessProfile.data.gst_number}</Text>
          ) : null}
          {businessProfile.data.vat_number ? (
            <Text>VAT: {businessProfile.data.vat_number}</Text>
          ) : null}
        </View>
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
  profileBox: {
    alignItems: "center",
    gap: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
});
