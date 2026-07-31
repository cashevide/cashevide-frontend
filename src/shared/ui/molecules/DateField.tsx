import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Native-only import — @expo/ui wraps Jetpack Compose (Android) / SwiftUI
// (iOS) pickers, no web support. Web uses the plain HTML <input type="date">
// element instead (see the web branch below).
let NativeDateTimePicker:
  | typeof import("@expo/ui/community/datetime-picker").default
  | null = null;

if (Platform.OS !== "web") {
  NativeDateTimePicker = require("@expo/ui/community/datetime-picker").default;
}

// Formats a Date object as YYYY-MM-DD (the format the backend's date
// fields expect) using local date parts — not toISOString(), which shifts
// the date across timezone boundaries near midnight.
function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

type DateFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
};

export function DateField({
  label,
  value,
  onChange,
  placeholder = "Any",
}: DateFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (Platform.OS === "web") {
    return (
      <View style={styles.fieldWeb}>
        <Text style={styles.label}>{label}</Text>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <input
          type="date"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || undefined)}
          style={webDateInputStyle}
        />
      </View>
    );
  }

  return (
    <View style={styles.fieldNative}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setPickerOpen(true)}
      >
        <Text>{value ?? placeholder}</Text>
      </TouchableOpacity>

      {pickerOpen && NativeDateTimePicker && (
        <NativeDateTimePicker
          value={parseDateString(value) ?? new Date()}
          mode="date"
          presentation="dialog"
          onValueChange={(_event, selectedDate) => {
            setPickerOpen(false);
            if (selectedDate) {
              onChange(toDateString(selectedDate));
            }
          }}
        />
      )}
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const webDateInputStyle: any = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 4,
  padding: 8,
  fontSize: 14,
};

const styles = StyleSheet.create({
  fieldWeb: {
    flex: 1,
  },
  fieldNative: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  button: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
});
