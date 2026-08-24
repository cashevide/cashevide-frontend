import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import {
  Text,
  Input,
  SearchInput,
  OtpInput,
  PhoneNumberInput,
} from "@/src/shared/ui";

export default function DesignInputs() {
  const [password, setPassword] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchWithText, setSearchWithText] = useState("Invoice #1024");
  const [otpValue, setOtpValue] = useState("");
  const [otpErrorValue, setOtpErrorValue] = useState("482");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-10">
        <Text variant="title">Inputs</Text>

        <View className="flex-row flex-wrap gap-x-12 gap-y-10">
          {/* Column 1: Text Input + Search Input (paired by content weight) */}
          <View className="gap-10 w-[400px]">
            <View className="gap-6">
              <Text variant="subheading">Text Input</Text>

              <View className="gap-6">
                <Input label="Default" placeholder="Enter your name" />

                <Input
                  label="With Error"
                  placeholder="Enter your email"
                  error="Please enter a valid email address"
                />

                <Input
                  label="Success"
                  placeholder="Username"
                  isSuccess
                  defaultValue="noufal_k"
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                />

                <Input
                  label="Disabled"
                  placeholder="Cannot edit this"
                  disabled
                />
              </View>
            </View>

            <View className="gap-6">
              <Text variant="subheading">Search Input</Text>

              <View className="gap-6">
                <View className="gap-1.5">
                  <Text variant="caption">Empty</Text>
                  <SearchInput
                    value={searchValue}
                    onChangeText={setSearchValue}
                    onClear={() => setSearchValue("")}
                    placeholder="Search clients"
                  />
                </View>

                <View className="gap-1.5">
                  <Text variant="caption">With value (shows clear button)</Text>
                  <SearchInput
                    value={searchWithText}
                    onChangeText={setSearchWithText}
                    onClear={() => setSearchWithText("")}
                    placeholder="Search invoices"
                  />
                </View>
              </View>
            </View>

            <View className="gap-6">
              <Text variant="subheading">Phone Number Input</Text>

              <View className="gap-3">
                <PhoneNumberInput onChangeFullNumber={setPhoneNumber} />
                <Text variant="caption">
                  Full number: {phoneNumber || "(empty)"}
                </Text>
              </View>
            </View>
          </View>

          {/* Column 2: OTP Input */}
          <View className="gap-6 w-[400px]">
            <Text variant="subheading">OTP Input</Text>

            <View className="gap-6">
              <View className="gap-1.5 self-start">
                <Text variant="caption">Default (6 digits)</Text>
                <OtpInput value={otpValue} onChangeText={setOtpValue} />
              </View>

              <View className="gap-1.5 self-start">
                <Text variant="caption">Error state</Text>
                <OtpInput
                  value={otpErrorValue}
                  onChangeText={setOtpErrorValue}
                  error
                />
              </View>

              <View className="gap-1.5 self-start">
                <Text variant="caption">Disabled</Text>
                <OtpInput value="123456" onChangeText={() => {}} disabled />
              </View>

              <View className="gap-1.5 self-start">
                <Text variant="caption">4-digit variant</Text>
                <OtpInput value="" onChangeText={() => {}} length={4} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
