import { useMemo, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import worldCountries from "world-countries";

import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";
import { Text } from "../atoms/Text";
import { Modal } from "./Modal";

type CurrencyOption = {
  // Country identity — used as the FlatList key and to detect the
  // currently-selected row (multiple countries can share a currency
  // code, e.g. EUR across the Eurozone, so cca2 is the unique key,
  // not the currency code).
  cca2: string;
  countryName: string;
  flag: string;
  currencyCode: string;
  currencyName: string;
};

// A handful of territories/countries carry no currency at all
// (Antarctica, Bouvet Island, ...) — excluded, since there's nothing
// to select. Note: world-countries gives these an empty object
// (`currencies: {}`), not `undefined`/missing, so a plain truthy
// check on `country.currencies` isn't enough — it has to check for
// at least one key, or Object.keys(...)[0] resolves to undefined and
// the next line crashes reading `.name` off it. Where a country lists
// more than one currency (20 cases, e.g. Bahamas: BSD + USD), the
// first listed is used as that country's entry — good enough for a
// country-driven picker; someone needing the secondary currency can
// search by currency code instead.
const ALL_CURRENCY_OPTIONS: CurrencyOption[] = worldCountries
  .filter(
    (country) =>
      country.currencies && Object.keys(country.currencies).length > 0,
  )
  .map((country) => {
    const currencyCode = Object.keys(country.currencies)[0];
    const currencyName = country.currencies[currencyCode].name;

    return {
      cca2: country.cca2,
      countryName: country.name.common,
      flag: country.flag,
      currencyCode,
      currencyName,
    };
  })
  .sort((a, b) => a.countryName.localeCompare(b.countryName));

type CurrencyPickerProps = {
  value: string;
  onChange: (currencyCode: string) => void;
  placeholder?: string;
};

export const CurrencyPicker = ({
  value,
  onChange,
  placeholder = "Select currency",
}: CurrencyPickerProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // The trigger shows one flag + code even if several countries share
  // that currency (e.g. selecting "EUR" via France then reopening the
  // picker later) — first match by currency code is enough since the
  // flag is just a compact visual hint, not a claim about which
  // country was originally chosen.
  const selectedOption = ALL_CURRENCY_OPTIONS.find(
    (option) => option.currencyCode === value,
  );

  function handleSelect(option: CurrencyOption) {
    onChange(option.currencyCode);
    setIsPickerOpen(false);
    setSearchQuery("");
  }

  function openPicker() {
    setSearchQuery("");
    setIsPickerOpen(true);
  }

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_CURRENCY_OPTIONS;

    return ALL_CURRENCY_OPTIONS.filter(
      (option) =>
        option.countryName.toLowerCase().includes(query) ||
        option.currencyCode.toLowerCase().includes(query) ||
        option.currencyName.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <View className="w-full">
      <Pressable
        onPress={openPicker}
        className={getInputFieldClasses({
          state: "default",
          className: "flex-row items-center",
        })}
      >
        {selectedOption ? (
          <Text variant="body">
            {selectedOption.flag} {selectedOption.currencyCode}
          </Text>
        ) : (
          <Text variant="body" className="text-muted-foreground">
            {placeholder}
          </Text>
        )}
      </Pressable>

      <Modal
        visible={isPickerOpen}
        dismissible
        onDismiss={() => setIsPickerOpen(false)}
        title="Select currency"
        className="max-h-[80%]"
      >
        <View className="gap-3">
          <View className="relative justify-center">
            <View className="absolute left-3 z-10">
              <MagnifyingGlassIcon
                width={18}
                height={18}
                color="rgb(var(--color-muted-foreground))"
              />
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search country or currency"
              autoFocus
              style={inputFieldWebResetStyle}
              className={getInputFieldClasses({
                state: "default",
                className: "pl-10",
              })}
            />
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.cca2}
            style={{ maxHeight: 360 }}
            // web:pr-2 keeps the browser's native scrollbar off the row
            // content — this FlatList is its own independent scroll
            // container nested inside Modal's ScrollView, so it needs
            // the same fix applied separately (see Modal.tsx).
            className="web:pr-2"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="flex-row items-center gap-3 py-3"
              >
                <Text variant="body">{item.flag}</Text>
                <Text variant="body" className="flex-1">
                  {item.countryName}
                </Text>
                <Text variant="body-sm" className="text-muted-foreground">
                  {item.currencyCode}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};
