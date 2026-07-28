import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";

export default function EditBusinessProfileScreen() {
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [currency, setCurrency] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  useEffect(() => {
    if (businessProfile.data) {
      setBusinessName(businessProfile.data.business_name);
      setAddress(businessProfile.data.address);
      setPhoneNumber(businessProfile.data.phone_number);
      setWebsite(businessProfile.data.website);
      setCurrency(businessProfile.data.currency);
      setGstNumber(businessProfile.data.gst_number);
      setVatNumber(businessProfile.data.vat_number);
    }
  }, [businessProfile.data]);

  const handleSave = () => {
    updateBusinessProfile.mutate(
      {
        business_name: businessName,
        address,
        phone_number: phoneNumber,
        website,
        currency,
        gst_number: gstNumber,
        vat_number: vatNumber,
      },
      {
        onSuccess: () => {
          router.replace("/profile/business");
        },
      },
    );
  };

  if (businessProfile.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading business profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Edit Business Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Currency (e.g. INR)"
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Website (optional)"
        value={website}
        onChangeText={setWebsite}
        autoCapitalize="none"
        keyboardType="url"
      />
      <TextInput
        style={styles.input}
        placeholder="GST Number (optional)"
        value={gstNumber}
        onChangeText={setGstNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="VAT Number (optional)"
        value={vatNumber}
        onChangeText={setVatNumber}
      />

      <Button
        title="Save"
        onPress={handleSave}
        disabled={
          updateBusinessProfile.isPending ||
          !businessName ||
          !address ||
          !phoneNumber ||
          !currency
        }
      />

      {updateBusinessProfile.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (updateBusinessProfile.error as any)?.response?.data ??
              updateBusinessProfile.error.message,
          )}
        </Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    width: "80%",
  },
  error: {
    color: "red",
    paddingHorizontal: 16,
    textAlign: "center",
  },
});
