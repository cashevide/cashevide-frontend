import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";

import { Text } from "../atoms/Text";
import {
  getInputFieldClasses,
  inputFieldWebResetStyle,
} from "../utils/inputFieldStyles";
import { Modal } from "./Modal";

// Native-only import — @expo/ui wraps Jetpack Compose (Android) / SwiftUI
// (iOS) pickers, no web support. Web renders its own custom calendar
// instead (see the web branch below), since a raw <input type="date">
// displays in the browser's locale format, which can't be overridden.
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

// Display-only formatting for the native (non-web) collapsed field —
// converts the stored YYYY-MM-DD value to DD/MM/YY for display.
function formatDisplayDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year.slice(2)}`;
}

// Converts a stored YYYY-MM-DD value into the DD/MM/YYYY text shown in
// the web text input while the user isn't actively typing over it.
function toTypedFormat(value: string | undefined): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

// Parses a DD/MM/YYYY typed string back into YYYY-MM-DD, validating
// that the date is real (not just numerically in range — e.g. rejects
// 31/02/2026). Returns undefined for anything incomplete or invalid.
function parseTypedFormat(typed: string): string | undefined {
  const match = typed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? `${yearStr}-${monthStr}-${dayStr}` : undefined;
}

// Auto-inserts "/" separators as the user types digits, and blocks
// anything past 8 digits (DDMMYYYY) — mirrors the digit-cleaning
// pattern used in PhoneNumberInput/OtpInput rather than relying on an
// input mask library.
function autoFormatTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

// Builds a 6-row grid (42 cells) covering the visible month plus the
// leading/trailing days needed to fill complete weeks — the standard
// shape for a month-grid calendar.
function buildCalendarGrid(monthAnchor: Date): CalendarDay[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, isCurrentMonth: date.getMonth() === month };
  });
}

// Builds a 12-year block for the year picker, anchored so the given
// year falls within it (not necessarily at the start) — keeps the
// currently-shown year visible when first opening the picker rather
// than always starting the block at a round decade boundary.
function buildYearGrid(anchorYear: number): number[] {
  const blockStart = anchorYear - (anchorYear % 12);
  return Array.from({ length: 12 }, (_, index) => blockStart + index);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
      <WebDateField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }

  return (
    <View className="flex-1 gap-1">
      <Text variant="body-sm" className="text-muted-foreground">
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setPickerOpen(true)}
        className={getInputFieldClasses({ state: "default" })}
      >
        <Text
          variant="body-sm"
          className={value ? "" : "text-muted-foreground"}
        >
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
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

// Web implementation — a typed DD/MM/YYYY text field plus a calendar
// icon that opens a custom calendar in a Modal. Kept as a separate
// component (rather than inline in the branch above) since it owns a
// meaningful amount of its own state (typed text, calendar month,
// focus) that has no equivalent on the native side.
function WebDateField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder: string;
}) {
  const [typedValue, setTypedValue] = useState(() => toTypedFormat(value));
  const [isFocused, setIsFocused] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    () => parseDateString(value) ?? new Date(),
  );
  // "days" shows the month grid; "years" shows a 12-year picker for
  // jumping several years at once, since paging month-by-month to go
  // back a couple of years takes far too many taps.
  const [calendarView, setCalendarView] = useState<"days" | "years">("days");

  // Keep the typed text in sync when `value` changes from outside
  // (calendar selection, or the parent resetting the field) — but not
  // while the field is focused, so a mid-typing rerender from a
  // debounced onChange upstream doesn't fight the user's keystrokes.
  useEffect(() => {
    if (!isFocused) {
      setTypedValue(toTypedFormat(value));
    }
  }, [value, isFocused]);

  function handleTypedChange(text: string) {
    const formatted = autoFormatTyping(text);
    setTypedValue(formatted);

    const parsed = parseTypedFormat(formatted);
    if (parsed) {
      onChange(parsed);
      setCalendarMonth(parseDateString(parsed) ?? new Date());
    } else if (formatted.length === 0) {
      onChange(undefined);
    }
  }

  function handleBlur() {
    setIsFocused(false);
    // Revert to the last valid value's formatting if what's left typed
    // doesn't parse — avoids leaving a half-typed "15/03/" behind.
    setTypedValue(toTypedFormat(value));
  }

  function openCalendar() {
    setCalendarMonth(parseDateString(value) ?? new Date());
    setCalendarView("days");
    setCalendarOpen(true);
  }

  function handleSelectDay(date: Date) {
    const dateString = toDateString(date);
    onChange(dateString);
    setTypedValue(toTypedFormat(dateString));
    setCalendarOpen(false);
  }

  function handleSelectYear(year: number) {
    setCalendarMonth(new Date(year, calendarMonth.getMonth(), 1));
    setCalendarView("days");
  }

  const grid = useMemo(() => buildCalendarGrid(calendarMonth), [calendarMonth]);
  const yearGrid = useMemo(
    () => buildYearGrid(calendarMonth.getFullYear()),
    [calendarMonth],
  );
  const selectedDate = parseDateString(value);
  const today = new Date();

  return (
    <View className="flex-1 gap-1">
      <Text variant="body-sm" className="text-muted-foreground">
        {label}
      </Text>

      <View className="relative justify-center">
        <TextInput
          value={typedValue}
          onChangeText={handleTypedChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="DD/MM/YYYY"
          keyboardType="number-pad"
          style={inputFieldWebResetStyle}
          className={getInputFieldClasses({
            state: "default",
            className: "pr-11",
          })}
        />

        <Pressable
          onPress={openCalendar}
          hitSlop={8}
          className="absolute right-3"
        >
          <CalendarDaysIcon
            width={18}
            height={18}
            color="rgb(var(--color-muted-foreground))"
          />
        </Pressable>
      </View>

      <Modal
        visible={calendarOpen}
        dismissible
        onDismiss={() => setCalendarOpen(false)}
        className="max-w-[320px]"
      >
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => {
                if (calendarView === "days") {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1,
                    ),
                  );
                } else {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear() - 12,
                      calendarMonth.getMonth(),
                      1,
                    ),
                  );
                }
              }}
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-md active:bg-secondary"
            >
              <ChevronLeftIcon
                width={18}
                height={18}
                color="rgb(var(--color-foreground))"
              />
            </Pressable>

            <Pressable
              onPress={() =>
                setCalendarView((prev) => (prev === "days" ? "years" : "days"))
              }
              className="rounded-md px-2 py-1 active:bg-secondary"
            >
              <Text variant="body-sm" className="font-semibold">
                {calendarView === "days"
                  ? `${MONTH_LABELS[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`
                  : `${yearGrid[0]} – ${yearGrid[yearGrid.length - 1]}`}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (calendarView === "days") {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1,
                    ),
                  );
                } else {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear() + 12,
                      calendarMonth.getMonth(),
                      1,
                    ),
                  );
                }
              }}
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-md active:bg-secondary"
            >
              <ChevronRightIcon
                width={18}
                height={18}
                color="rgb(var(--color-foreground))"
              />
            </Pressable>
          </View>

          {calendarView === "years" ? (
            <View className="flex-row flex-wrap">
              {yearGrid.map((year) => {
                const isSelectedYear = selectedDate?.getFullYear() === year;
                const isCurrentYear = today.getFullYear() === year;

                return (
                  <Pressable
                    key={year}
                    onPress={() => handleSelectYear(year)}
                    className="w-1/3 items-center justify-center py-3"
                  >
                    <View
                      className={
                        isSelectedYear
                          ? "h-9 w-16 items-center justify-center rounded-full bg-primary"
                          : "h-9 w-16 items-center justify-center rounded-full active:bg-secondary"
                      }
                    >
                      <Text
                        variant="body-sm"
                        className={
                          isSelectedYear
                            ? "text-primary-foreground"
                            : isCurrentYear
                              ? "text-primary font-semibold"
                              : "text-foreground"
                        }
                      >
                        {year}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="gap-1">
              <View className="flex-row">
                {WEEKDAY_LABELS.map((day, index) => (
                  <View key={index} className="flex-1 items-center py-1">
                    <Text variant="caption" className="text-muted-foreground">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {Array.from({ length: 6 }, (_, week) => (
                <View key={week} className="flex-row">
                  {grid
                    .slice(week * 7, week * 7 + 7)
                    .map(({ date, isCurrentMonth }) => {
                      const isSelected =
                        selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, today);

                      return (
                        <Pressable
                          key={date.toISOString()}
                          onPress={() => handleSelectDay(date)}
                          className="flex-1 aspect-square items-center justify-center"
                        >
                          <View
                            className={
                              isSelected
                                ? "h-8 w-8 items-center justify-center rounded-full bg-primary"
                                : "h-8 w-8 items-center justify-center rounded-full active:bg-secondary"
                            }
                          >
                            <Text
                              variant="body-sm"
                              className={
                                isSelected
                                  ? "text-primary-foreground"
                                  : !isCurrentMonth
                                    ? "text-muted-foreground/40"
                                    : isToday
                                      ? "text-primary font-semibold"
                                      : "text-foreground"
                              }
                            >
                              {date.getDate()}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                </View>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
