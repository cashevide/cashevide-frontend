import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import {
  EnvelopeIcon,
  BriefcaseIcon,
  PhoneIcon,
  SparklesIcon,
  IdentificationIcon,
  GiftIcon,
} from "react-native-heroicons/outline";

import ProfileSubTabs from "../components/ProfileSubTabs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  Spinner,
  AvatarPicker,
  InfoListRow,
} from "@/src/shared/ui";

export default function ProfileScreen() {
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopyReferralCode() {
    if (!userProfile.data?.referral_code) {
      return;
    }

    await Clipboard.setStringAsync(userProfile.data.referral_code);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  }

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
                    size={112}
                  />

                  <Text variant="heading" className="text-center">
                    {userProfile.data.full_name}
                  </Text>
                </View>

                <View className="bg-card border border-border rounded-lg px-4">
                  <InfoListRow
                    icon={EnvelopeIcon}
                    label="Email"
                    value={userProfile.data.email}
                  />
                  <InfoListRow
                    icon={IdentificationIcon}
                    label="Username"
                    value={userProfile.data.username}
                  />
                  <InfoListRow
                    icon={BriefcaseIcon}
                    label="Job Title"
                    value={userProfile.data.job_title}
                  />
                  <InfoListRow
                    icon={PhoneIcon}
                    label="Phone"
                    value={userProfile.data.phone_number}
                  />
                  <InfoListRow
                    icon={SparklesIcon}
                    label="Credit Points"
                    value={String(userProfile.data.credit_points)}
                  />
                  <InfoListRow
                    icon={GiftIcon}
                    label="Referral Code"
                    value={
                      justCopied ? "Copied!" : userProfile.data.referral_code
                    }
                    onCopy={handleCopyReferralCode}
                    isLast
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
