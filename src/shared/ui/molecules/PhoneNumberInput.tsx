import { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import worldCountries from "world-countries";

import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";
import { Text } from "../atoms/Text";
import { Divider } from "../atoms/Divider";
import { Modal } from "./Modal";

type Country = {
  name: string;
  cca2: string;
  flag: string;
  callingCode: string;
};

// For most countries idd.root + idd.suffixes[0] is the calling code.
// But a handful of countries share a root that's already a complete,
// standalone calling code, where the "suffixes" list is really just
// regional/area-code numbering, not part of the country code itself —
// most notably root "+1" (NANP: US, Canada, Dominican Republic, Puerto
// Rico, and ~20 Caribbean nations, whose suffixes are area codes like
// "201" for New Jersey) and root "+7" (Russia/Kazakhstan). Appending
// idd.suffixes[0] there would produce garbage like "+1201" for the US.
// Verified against the actual world-countries data: this split correctly
// resolves every case we checked (US/Canada -> +1, Vatican -> +3906698,
// Åland -> +35818, Western Sahara -> +2125288, Norway -> +47).
const SHARED_STANDALONE_ROOTS = new Set(["1", "7"]);

// world-countries lists each further-subdivided nation only once per
// entry (not once per suffix) — collapse is not needed, but multiple
// countries can still resolve to the same final calling code (see
// SHARED_STANDALONE_ROOTS above), which is handled at lookup time below.
const ALL_COUNTRIES: Country[] = worldCountries
  .filter((country) => country.idd?.root)
  .map((country) => {
    const root = country.idd.root.replace("+", "");
    const suffixes = country.idd.suffixes ?? [];

    const callingCode =
      suffixes.length === 0 || SHARED_STANDALONE_ROOTS.has(root)
        ? root
        : `${root}${suffixes[0]}`;

    return {
      name: country.name.common,
      cca2: country.cca2,
      flag: country.flag,
      callingCode,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Multiple countries can share the same calling code (+1 covers the US,
// Canada, and a dozen Caribbean nations). Auto-detection below only fires
// on an unambiguous match, so this intentionally keeps just the first
// country seen per code — good enough for a lookup table, not used to
// decide ambiguous matches.
const COUNTRY_BY_CALLING_CODE = new Map<string, Country>();
for (const country of ALL_COUNTRIES) {
  if (!COUNTRY_BY_CALLING_CODE.has(country.callingCode)) {
    COUNTRY_BY_CALLING_CODE.set(country.callingCode, country);
  }
}

// How many countries share this exact calling code — used to decide
// whether typing it is enough to auto-select (only when unambiguous).
const CALLING_CODE_COUNTS = ALL_COUNTRIES.reduce<Record<string, number>>(
  (acc, country) => {
    acc[country.callingCode] = (acc[country.callingCode] ?? 0) + 1;
    return acc;
  },
  {},
);

const ALL_CALLING_CODES = [...COUNTRY_BY_CALLING_CODE.keys()];

// Codes that are themselves a *prefix* of some other, longer calling
// code — e.g. "39" (Italy) is a prefix of "3906698" (Vatican City), and
// "47" (Norway) is a prefix of "4779" (Svalbard and Jan Mayen). A handful
// of dependent territories share their parent country's code with an
// extended suffix like this. If we auto-jumped the instant "39" matched
// Italy exactly, a user typing toward "3906698" for Vatican City would
// get yanked to the number field after the 2nd digit and never get the
// chance to finish. So codes in this set are excluded from auto-jump —
// the user finishes typing, then explicitly moves on (blur/next field)
// or opens the picker to disambiguate.
const CODES_WITH_LONGER_MATCH = new Set(
  ALL_CALLING_CODES.filter((code) =>
    ALL_CALLING_CODES.some((other) => other !== code && other.startsWith(code)),
  ),
);

const DEFAULT_COUNTRY = COUNTRY_BY_CALLING_CODE.get("91") ?? ALL_COUNTRIES[0];

type PhoneNumberInputProps = {
  onChangeFullNumber: (fullNumber: string) => void;
};

export function PhoneNumberInput({
  onChangeFullNumber,
}: PhoneNumberInputProps) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [codeDigits, setCodeDigits] = useState(DEFAULT_COUNTRY.callingCode);
  const [localNumber, setLocalNumber] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  const numberInputRef = useRef<TextInput>(null);
  const codeInputRef = useRef<TextInput>(null);

  function emitChange(callingCode: string, number: string) {
    onChangeFullNumber(number ? `+${callingCode}${number}` : "");
  }

  function handleCodeChange(text: string) {
    const digits = text.replace(/\D/g, "");
    setCodeDigits(digits);

    // Only auto-select and jump ahead on an exact, unambiguous match:
    // unique to one country (not shared like +1) AND not itself a
    // prefix of some longer valid code (not like +39 vs +3906698).
    const match = COUNTRY_BY_CALLING_CODE.get(digits);
    const isUnambiguous =
      match &&
      CALLING_CODE_COUNTS[digits] === 1 &&
      !CODES_WITH_LONGER_MATCH.has(digits);

    if (isUnambiguous) {
      setCountry(match);
      emitChange(digits, localNumber);
      numberInputRef.current?.focus();
      return;
    }

    emitChange(digits, localNumber);
  }

  // When the code field loses focus (user tapped/tabbed to the number
  // field, or elsewhere) without an auto-jump having fired — e.g. they
  // typed "1" and moved on manually, or typed "39" and tapped away
  // rather than continuing toward "3906698" — resolve whatever exact
  // match exists now so the flag/country shown isn't left stale.
  function handleCodeBlur() {
    setIsCodeFocused(false);
    const match = COUNTRY_BY_CALLING_CODE.get(codeDigits);
    if (match && match.cca2 !== country.cca2) {
      setCountry(match);
    }
  }

  function handleNumberChange(text: string) {
    const digits = text.replace(/\D/g, "");
    setLocalNumber(digits);
    emitChange(codeDigits, digits);
  }

  // Backspacing out of an empty number field returns focus to the code
  // field, mirroring how a single continuous field would behave.
  function handleNumberKeyPress(key: string) {
    if (key === "Backspace" && localNumber.length === 0) {
      codeInputRef.current?.focus();
    }
  }

  function handleSelectCountry(selected: Country) {
    setCountry(selected);
    setCodeDigits(selected.callingCode);
    emitChange(selected.callingCode, localNumber);
    setIsPickerOpen(false);
    setSearchQuery("");
    numberInputRef.current?.focus();
  }

  function openPicker() {
    setSearchQuery("");
    setIsPickerOpen(true);
  }

  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_COUNTRIES;

    return ALL_COUNTRIES.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.callingCode.includes(query),
    );
  }, [searchQuery]);

  const isFocused = isCodeFocused || isNumberFocused;
  const fieldState = isFocused ? "focused" : "default";

  return (
    <View className="w-full">
      <View
        className={getInputFieldClasses({
          state: fieldState,
          className: "w-full flex-row items-center px-0",
        })}
      >
        <Pressable onPress={openPicker} className="pl-4 pr-2" hitSlop={8}>
          <Text variant="body">{country.flag}</Text>
        </Pressable>

        <TextInput
          ref={codeInputRef}
          value={`+${codeDigits}`}
          onChangeText={(text) => handleCodeChange(text.replace("+", ""))}
          onFocus={() => setIsCodeFocused(true)}
          onBlur={handleCodeBlur}
          keyboardType="phone-pad"
          style={inputFieldWebResetStyle}
          className="w-16 h-full bg-transparent text-foreground border-0 placeholder:text-muted-foreground"
        />

        <Divider orientation="vertical" className="my-3" />

        <TextInput
          ref={numberInputRef}
          value={localNumber}
          onChangeText={handleNumberChange}
          onKeyPress={(e) => handleNumberKeyPress(e.nativeEvent.key)}
          onFocus={() => setIsNumberFocused(true)}
          onBlur={() => setIsNumberFocused(false)}
          placeholder="Phone number"
          keyboardType="phone-pad"
          style={inputFieldWebResetStyle}
          className="flex-1 h-full pl-3 pr-4 bg-transparent text-foreground border-0 placeholder:text-muted-foreground"
        />
      </View>

      <Modal
        visible={isPickerOpen}
        dismissible
        onDismiss={() => setIsPickerOpen(false)}
        title="Select country"
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
              placeholder="Search country or code"
              autoFocus
              style={inputFieldWebResetStyle}
              className={getInputFieldClasses({
                state: "default",
                className: "pl-10",
              })}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.cca2}
            style={{ maxHeight: 360 }}
            // web:pr-2 keeps the browser's native scrollbar off the row
            // content — see CurrencyPicker.tsx for the full explanation.
            className="web:pr-2"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectCountry(item)}
                className="flex-row items-center gap-3 py-3"
              >
                <Text variant="body">{item.flag}</Text>
                <Text variant="body" className="flex-1">
                  {item.name}
                </Text>
                <Text variant="body-sm" className="text-muted-foreground">
                  +{item.callingCode}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
