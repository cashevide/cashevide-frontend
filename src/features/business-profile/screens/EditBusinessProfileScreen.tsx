import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Input,
  Button,
  Spinner,
  CurrencyPicker,
  AvatarPicker,
} from "@/src/shared/ui";

type LogoAsset = { uri: string; name: string; type: string };

export default function EditBusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [currency, setCurrency] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  // Logo is handled separately from the text fields — it is never
  // uploaded immediately on pick. It is only sent as part of the same
  // PATCH as everything else, when "Save" is pressed.
  // logoAsset: a newly picked image staged for upload.
  // logoRemoved: user tapped "Remove Photo" — clear the logo on save.
  // Both stay in sync (picking a new photo cancels a pending removal,
  // and vice versa) so handleSave can trust a single source of truth.
  const [logoAsset, setLogoAsset] = useState<LogoAsset | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  // Logo is required for invoice generation, but unlike the text fields
  // above we don't disable the Save button for it — the button always
  // stays pressable, and this message only appears after a press with
  // no logo present. Cleared as soon as the user picks a photo.
  const [logoErrorMessage, setLogoErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (businessProfile.data) {
      setBusinessName(businessProfile.data.business_name);
      setAddress(businessProfile.data.address);
      setPhoneNumber(businessProfile.data.phone_number);
      setBusinessEmail(businessProfile.data.business_email);
      setWebsite(businessProfile.data.website);
      setCurrency(businessProfile.data.currency);
      setGstNumber(businessProfile.data.gst_number);
      setVatNumber(businessProfile.data.vat_number);
    }
  }, [businessProfile.data]);

  function handlePickLogo(asset: LogoAsset) {
    setLogoAsset(asset);
    setLogoRemoved(false);
    setLogoErrorMessage(null);
  }

  function handleRemoveLogo() {
    setLogoAsset(null);
    setLogoRemoved(true);
  }

  function handleSave() {
    // Backend logo field is optional, but a logo is mandatory here
    // because invoices can't generate without one. This check runs
    // only on Save press — the button itself stays enabled so tapping
    // it is what surfaces the requirement, rather than a silently
    // disabled button the user has to guess the reason for.
    const willHaveLogo = logoRemoved
      ? false
      : !!(logoAsset ?? businessProfile.data?.logo);

    if (!willHaveLogo) {
      setLogoErrorMessage("Business logo is required to generate invoices.");
      return;
    }

    updateBusinessProfile.mutate(
      {
        business_name: businessName,
        address,
        phone_number: phoneNumber,
        business_email: businessEmail,
        website,
        currency,
        gst_number: gstNumber,
        vat_number: vatNumber,
        // undefined (key omitted): logo unchanged.
        // logoAsset: a new photo was picked — upload it.
        // null: "Remove Photo" was pressed — clear it on the server.
        ...(logoAsset
          ? { logo: logoAsset }
          : logoRemoved
            ? { logo: null }
            : {}),
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.profile.business);
        },
      },
    );
  }

  // logoErrorMessage takes priority — it reflects the most recent Save
  // attempt. Once it's set, the API error (from a prior attempt, if
  // any) is stale and shouldn't be shown alongside it.
  const errorMessage =
    logoErrorMessage ??
    (updateBusinessProfile.isError
      ? getFieldErrorMessage(updateBusinessProfile.error)
      : null);

  const canSubmit =
    businessName.trim().length > 0 &&
    address.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    currency.trim().length > 0;

  if (businessProfile.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Business Profile"
          showBackButton
          containerVariant="narrow"
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  // The avatar preview is fully local/optimistic here: a picked photo
  // shows via logoAsset.uri, a pending removal shows the placeholder,
  // and otherwise we fall back to the server's current logo. None of
  // this touches the network — AvatarPicker's isUploading/isError stay
  // tied to the single handleSave mutation, not to picking itself.
  const logoPreviewUri = logoRemoved
    ? null
    : (logoAsset?.uri ?? businessProfile.data?.logo ?? null);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Edit Business Profile"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="gap-4 px-6 py-6">
          <View className="items-center pb-2">
            <AvatarPicker
              imageUri={logoPreviewUri}
              onPick={handlePickLogo}
              onRemove={handleRemoveLogo}
              shape="square"
              placeholderText="Add Logo"
              fileName="logo.jpg"
            />
          </View>

          <Input
            placeholder="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
          />

          <Input
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Input
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Input
            placeholder="Business Email (optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={businessEmail}
            onChangeText={setBusinessEmail}
          />

          <View className="gap-1">
            <Text variant="body-sm" className="text-muted-foreground">
              Currency
            </Text>
            <CurrencyPicker value={currency} onChange={setCurrency} />
          </View>

          <Input
            placeholder="Website (optional)"
            keyboardType="url"
            autoCapitalize="none"
            value={website}
            onChangeText={setWebsite}
          />

          <Input
            placeholder="GST Number (optional)"
            value={gstNumber}
            onChangeText={setGstNumber}
          />

          <Input
            placeholder="VAT Number (optional)"
            value={vatNumber}
            onChangeText={setVatNumber}
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title="Save"
            onPress={handleSave}
            disabled={!canSubmit}
            isLoading={updateBusinessProfile.isPending}
          />
        </View>
      </Container>
    </View>
  );
}
