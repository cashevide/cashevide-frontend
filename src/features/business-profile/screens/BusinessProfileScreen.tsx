import { View } from "react-native";
import { router } from "expo-router";

import ProfileSubTabs from "@/src/features/profile/components/ProfileSubTabs";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner, AvatarPicker } from "@/src/shared/ui";

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View className="gap-0.5">
      <Text variant="caption">{label}</Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

export default function BusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Business Profile" containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          <ProfileSubTabs />

          {businessProfile.isLoading ? (
            <View className="flex-1 items-center justify-center py-16">
              <Spinner />
            </View>
          ) : (
            businessProfile.data && (
              <>
                <View className="items-center gap-3">
                  <AvatarPicker
                    imageUri={businessProfile.data.logo}
                    onPick={(asset) => {
                      updateBusinessProfile.mutate({ logo: asset });
                    }}
                    onRemove={() => {
                      updateBusinessProfile.mutate({ logo: null });
                    }}
                    isUploading={updateBusinessProfile.isPending}
                    isError={updateBusinessProfile.isError}
                    shape="square"
                    placeholderText="Add Logo"
                    fileName="logo.jpg"
                  />

                  <Text variant="heading" className="text-center">
                    {businessProfile.data.business_name ||
                      "Business name not set"}
                  </Text>
                </View>

                <View className="bg-card border border-border rounded-lg p-4 gap-4">
                  <InfoRow
                    label="Address"
                    value={businessProfile.data.address}
                  />
                  <InfoRow
                    label="Phone"
                    value={businessProfile.data.phone_number}
                  />
                  <InfoRow
                    label="Website"
                    value={businessProfile.data.website}
                  />
                  <InfoRow
                    label="Currency"
                    value={businessProfile.data.currency}
                  />
                  <InfoRow
                    label="GST Number"
                    value={businessProfile.data.gst_number}
                  />
                  <InfoRow
                    label="VAT Number"
                    value={businessProfile.data.vat_number}
                  />
                </View>

                <Button
                  variant="primary"
                  title="Edit Business Profile"
                  onPress={() => router.push(ROUTES.profile.businessEdit)}
                />
              </>
            )
          )}
        </View>
      </Container>
    </View>
  );
}
