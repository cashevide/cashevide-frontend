import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { AvatarPicker } from "@/src/shared/ui";
import ProfileSubTabs from "@/src/features/profile/components/ProfileSubTabs";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";

export default function BusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  return (
    <View style={styles.container}>
      <ProfileSubTabs />

      {businessProfile.isLoading && <Text>Loading business profile...</Text>}

      {businessProfile.data && (
        <View style={styles.profileBox}>
          <AvatarPicker
            imageUri={businessProfile.data.logo}
            onPick={(asset) => {
              updateBusinessProfile.mutate({ logo: asset });
            }}
            isUploading={updateBusinessProfile.isPending}
            isError={updateBusinessProfile.isError}
            shape="square"
            placeholderText="Add Logo"
            fileName="logo.jpg"
          />

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
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
});
