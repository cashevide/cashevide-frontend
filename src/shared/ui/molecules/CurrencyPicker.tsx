import { useMemo, useState } from "react";
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
import currencyCodes from "currency-codes";

type CurrencyPickerProps = {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
};

// Common currency -> ISO country-code mapping, used to derive a flag emoji.
// Not exhaustive — currencies without an entry here fall back to a generic icon.
const CURRENCY_COUNTRY_CODE: Record<string, string> = {
  INR: "IN",
  USD: "US",
  GBP: "GB",
  EUR: "EU",
  AED: "AE",
  SAR: "SA",
  CAD: "CA",
  AUD: "AU",
  SGD: "SG",
  JPY: "JP",
  CNY: "CN",
  PKR: "PK",
  BDT: "BD",
  QAR: "QA",
  KWD: "KW",
  OMR: "OM",
  BHD: "BH",
  NPR: "NP",
  LKR: "LK",
  MYR: "MY",
  THB: "TH",
  IDR: "ID",
  PHP: "PH",
  VND: "VN",
  ZAR: "ZA",
  CHF: "CH",
  SEK: "SE",
  NOK: "NO",
  DKK: "DK",
  NZD: "NZ",
  BRL: "BR",
  MXN: "MX",
  RUB: "RU",
  KRW: "KR",
  HKD: "HK",
};

function getFlagEmoji(countryCode: string): string {
  if (countryCode === "EU") return "🇪🇺";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const ALL_CURRENCIES = currencyCodes
  .codes()
  .map((code) => {
    const info = currencyCodes.code(code);
    const countryCode = CURRENCY_COUNTRY_CODE[code];
    return {
      code,
      name: info?.currency ?? code,
      flag: countryCode ? getFlagEmoji(countryCode) : "💱",
    };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

export const CurrencyPicker = ({
  value,
  onChange,
  placeholder = "Select currency",
}: CurrencyPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredCurrencies = useMemo(() => {
    if (!searchText) return ALL_CURRENCIES;
    const query = searchText.toLowerCase();
    return ALL_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query),
    );
  }, [searchText]);

  const selectedCurrency = ALL_CURRENCIES.find((c) => c.code === value);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={() => setIsOpen(true)}>
        {selectedCurrency ? (
          <Text style={styles.triggerText}>
            {selectedCurrency.flag} {selectedCurrency.code}
          </Text>
        ) : (
          <Text style={styles.triggerPlaceholder}>{placeholder}</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.content}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search currency code or name"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={styles.rowFlag}>{item.flag}</Text>
                  <Text style={styles.rowCode}>{item.code}</Text>
                  <Text style={styles.rowName}>{item.name}</Text>
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
  trigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  triggerText: {
    fontSize: 16,
  },
  triggerPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    backgroundColor: "#fff",
    maxHeight: "70%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowFlag: {
    fontSize: 20,
  },
  rowCode: {
    fontSize: 16,
    fontWeight: "bold",
    width: 50,
  },
  rowName: {
    fontSize: 16,
    flex: 1,
  },
});
