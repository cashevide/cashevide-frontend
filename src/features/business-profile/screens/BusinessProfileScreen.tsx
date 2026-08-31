import { View } from "react-native";
import { router } from "expo-router";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  IdentificationIcon,
} from "react-native-heroicons/outline";

import ProfileSubTabs from "@/src/features/profile/components/ProfileSubTabs";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
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

// Display-only — strips the protocol and any trailing slash so the
// info row reads "cashevide.com" instead of "https://cashevide.com/".
// The raw value (with protocol) is what's actually stored/edited; this
// never touches that, only what's shown here. Regex rather than the
// URL API, matching the codebase's existing getPageFromUrl precedent —
// URL parsing isn't reliable across all React Native environments.
function formatWebsiteForDisplay(url?: string): string | undefined {
  if (!url) {
    return url;
  }

  return url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export default function BusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  // GST and VAT are both optional and country-dependent — a business
  // might have neither, one, or both. InfoListRow hides empty fields
  // itself, so which row ends up drawn last (and therefore shouldn't
  // have a bottom divider) isn't fixed; this finds the actual last
  // populated field each render instead of assuming it's always VAT.
  const lastFieldKey = businessProfile.data
    ? (
        [
          ["address", businessProfile.data.address],
          ["phone", businessProfile.data.phone_number],
          ["email", businessProfile.data.business_email],
          ["website", businessProfile.data.website],
          ["currency", businessProfile.data.currency],
          ["gst", businessProfile.data.gst_number],
          ["vat", businessProfile.data.vat_number],
        ] as const
      )
        .filter(([, value]) => !!value)
        .at(-1)?.[0]
    : undefined;

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
                    size={112}
                  />

                  <Text variant="heading" className="text-center">
                    {businessProfile.data.business_name ||
                      "Business name not set"}
                  </Text>
                </View>

                <View className="bg-card border border-border rounded-lg px-4">
                  <InfoListRow
                    icon={MapPinIcon}
                    label="Address"
                    value={businessProfile.data.address}
                    isLast={lastFieldKey === "address"}
                  />
                  <InfoListRow
                    icon={PhoneIcon}
                    label="Phone"
                    value={businessProfile.data.phone_number}
                    isLast={lastFieldKey === "phone"}
                  />
                  <InfoListRow
                    icon={EnvelopeIcon}
                    label="Email"
                    value={businessProfile.data.business_email}
                    isLast={lastFieldKey === "email"}
                  />
                  <InfoListRow
                    icon={GlobeAltIcon}
                    label="Website"
                    value={formatWebsiteForDisplay(
                      businessProfile.data.website,
                    )}
                    isLast={lastFieldKey === "website"}
                  />
                  <InfoListRow
                    icon={CurrencyDollarIcon}
                    label="Currency"
                    value={businessProfile.data.currency}
                    isLast={lastFieldKey === "currency"}
                  />
                  <InfoListRow
                    icon={IdentificationIcon}
                    label="GST Number"
                    value={businessProfile.data.gst_number}
                    isLast={lastFieldKey === "gst"}
                  />
                  <InfoListRow
                    icon={IdentificationIcon}
                    label="VAT Number"
                    value={businessProfile.data.vat_number}
                    isLast={lastFieldKey === "vat"}
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
