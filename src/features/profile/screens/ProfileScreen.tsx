import { View } from "react-native";

import ProfileSubTabs from "../components/ProfileSubTabs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";
import { router } from "expo-router";
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

export default function ProfileScreen() {
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Profile" containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          <ProfileSubTabs />

          {userProfile.isLoading ? (
            <View className="flex-1 items-center justify-center py-16">
              <Spinner />
            </View>
          ) : (
            userProfile.data && (
              <>
                <View className="items-center gap-3">
                  <AvatarPicker
                    imageUri={userProfile.data.profile_picture}
                    onPick={(asset) => {
                      updateUserProfile.mutate({ profile_picture: asset });
                    }}
                    onRemove={() => {
                      updateUserProfile.mutate({ profile_picture: null });
                    }}
                    isUploading={updateUserProfile.isPending}
                    isError={updateUserProfile.isError}
                    shape="circle"
                    placeholderText="Add Photo"
                    fileName="profile_picture.jpg"
                  />

                  <Text variant="heading" className="text-center">
                    {userProfile.data.full_name}
                  </Text>
                </View>

                <View className="bg-card border border-border rounded-lg p-4 gap-4">
                  <InfoRow label="Email" value={userProfile.data.email} />
                  <InfoRow
                    label="Job Title"
                    value={userProfile.data.job_title}
                  />
                  <InfoRow
                    label="Phone"
                    value={userProfile.data.phone_number}
                  />
                  <InfoRow
                    label="Credit Points"
                    value={String(userProfile.data.credit_points)}
                  />
                </View>

                <Button
                  variant="primary"
                  title="Edit Personal Profile"
                  onPress={() => router.push(ROUTES.profile.edit)}
                />
              </>
            )
          )}
        </View>
      </Container>
    </View>
  );
}
