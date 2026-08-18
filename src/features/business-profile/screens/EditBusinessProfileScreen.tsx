import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Input, Button, Spinner, CurrencyPicker } from "@/src/shared/ui";

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

  function handleSave() {
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
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.profile.business);
        },
      },
    );
  }

  const errorMessage = updateBusinessProfile.isError
    ? getFieldErrorMessage(updateBusinessProfile.error)
    : null;

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

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Edit Business Profile"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="gap-4 px-6 py-6">
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
