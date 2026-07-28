import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Country = {
  name: string;
  code: string;
  flag: string;
  callingCode: string;
};

// Small static list — extend as needed. Not exhaustive by design.
const COUNTRIES: Country[] = [
  { name: "India", code: "IN", flag: "🇮🇳", callingCode: "91" },
  { name: "United States", code: "US", flag: "🇺🇸", callingCode: "1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", callingCode: "44" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", callingCode: "971" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", callingCode: "966" },
  { name: "Canada", code: "CA", flag: "🇨🇦", callingCode: "1" },
  { name: "Australia", code: "AU", flag: "🇦🇺", callingCode: "61" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", callingCode: "65" },
  { name: "Germany", code: "DE", flag: "🇩🇪", callingCode: "49" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰", callingCode: "92" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", callingCode: "880" },
  { name: "Qatar", code: "QA", flag: "🇶🇦", callingCode: "974" },
];

const COUNTRIES_BY_CALLING_CODE: Record<string, Country> = COUNTRIES.reduce(
  (acc, country) => {
    acc[country.callingCode] = country;
    return acc;
  },
  {} as Record<string, Country>,
);

type PhoneNumberInputProps = {
  onChangeFullNumber: (fullNumber: string) => void;
};

export const PhoneNumberInput = ({
  onChangeFullNumber,
}: PhoneNumberInputProps) => {
  // No country selected initially — flag shown blank until the user
  // either picks manually or types a calling code that exact-matches.
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [localNumber, setLocalNumber] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const emitChange = (country: Country | null, number: string) => {
    if (!country) {
      onChangeFullNumber("");
      return;
    }
    onChangeFullNumber(`+${country.callingCode}${number}`);
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    emitChange(country, localNumber);
    setIsPickerOpen(false);
  };

  const handleLocalNumberChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, "");

    // Only auto-detect while no country is locked in yet, and only on an
    // exact calling-code match — never re-interpret digits once a country
    // is already selected (avoids "92..." inside an Indian number being
    // mistaken for Pakistan's code).
    if (!selectedCountry && COUNTRIES_BY_CALLING_CODE[digitsOnly]) {
      const matchedCountry = COUNTRIES_BY_CALLING_CODE[digitsOnly];
      setSelectedCountry(matchedCountry);
      setLocalNumber("");
      emitChange(matchedCountry, "");
      return;
    }

    setLocalNumber(digitsOnly);
    emitChange(selectedCountry, digitsOnly);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.flagButton}
        onPress={() => setIsPickerOpen(true)}
      >
        <Text style={styles.flagText}>
          {selectedCountry ? selectedCountry.flag : "🏳️"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.numberSection}>
        {selectedCountry && (
          <Text style={styles.callingCodePrefix}>
            +{selectedCountry.callingCode}
          </Text>
        )}
        <TextInput
          style={styles.numberInput}
          placeholder="98765 43210"
          value={localNumber}
          onChangeText={handleLocalNumberChange}
          keyboardType="phone-pad"
        />
      </View>

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsPickerOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.countryRowFlag}>{item.flag}</Text>
                  <Text style={styles.countryRowCode}>+{item.callingCode}</Text>
                  <Text style={styles.countryRowName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  flagButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  flagText: {
    fontSize: 20,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
  numberSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
  callingCodePrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  numberInput: {
    flex: 1,
    padding: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    maxHeight: "60%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countryRowFlag: {
    fontSize: 20,
  },
  countryRowCode: {
    fontSize: 16,
    width: 50,
  },
  countryRowName: {
    fontSize: 16,
    flex: 1,
  },
});
