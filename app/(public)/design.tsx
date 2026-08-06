import { ScrollView, View } from "react-native";
import { ArrowRightIcon, TrashIcon } from "react-native-heroicons/outline";

import { Container } from "@/src/shared/layout/Container";
import { Text } from "@/src/shared/ui/atoms/Text";
import { Button } from "@/src/shared/ui/atoms/Button";
import { useThemeStore } from "@/src/store/themeStore";

const TYPOGRAPHY_VARIANTS = [
  { variant: "display", label: "Display" },
  { variant: "title", label: "Title" },
  { variant: "heading", label: "Heading" },
  { variant: "subheading", label: "Subheading" },
  { variant: "body-lg", label: "Body Large" },
  { variant: "body", label: "Body" },
  { variant: "body-sm", label: "Body Small" },
  { variant: "caption", label: "Caption" },
  { variant: "overline", label: "Overline" },
  { variant: "link", label: "Link" },
  { variant: "button", label: "Button" },
] as const;

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "brand",
  "success",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

export default function DesignScreen() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <Container variant="desktop" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-12 gap-14">
          <View className="flex-row items-center justify-between">
            <Text variant="title">Design System</Text>

            <Button
              variant="secondary"
              size="sm"
              title={theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </View>

          {/* Typography */}
          <View className="gap-6">
            <Text variant="heading">Typography</Text>

            <View className="gap-1">
              {TYPOGRAPHY_VARIANTS.map(({ variant, label }) => (
                <View
                  key={variant}
                  className="flex-row items-center gap-8 border-b border-border py-4"
                >
                  <Text
                    variant="caption"
                    className="w-28 shrink-0 text-muted-foreground"
                  >
                    {label}
                  </Text>

                  <View className="flex-1">
                    <Text
                      variant={variant}
                      className={variant === "button" ? "text-foreground" : ""}
                    >
                      The quick brown fox jumps
                    </Text>
                  </View>

                  <Text
                    variant="overline"
                    className="shrink-0 text-muted-foreground"
                  >
                    {variant}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Buttons - variants x states */}
          <View className="gap-6">
            <Text variant="heading">Buttons</Text>

            <View className="gap-1">
              {BUTTON_VARIANTS.map((variant) => (
                <View
                  key={variant}
                  className="flex-row items-center gap-8 border-b border-border py-5"
                >
                  <Text
                    variant="caption"
                    className="w-24 shrink-0 text-muted-foreground"
                  >
                    {variant}
                  </Text>

                  <View className="flex-row items-center gap-4">
                    <Button variant={variant} title="Button" />
                    <Button variant={variant} title="Loading" isLoading />
                    <Button variant={variant} title="Disabled" disabled />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Buttons - icons */}
          <View className="gap-6">
            <Text variant="heading">Buttons with Icons</Text>

            <View className="flex-row items-center gap-4 border-b border-border py-5">
              <Button
                variant="primary"
                title="Continue"
                rightIcon={<ArrowRightIcon size={18} />}
              />
              <Button
                variant="destructive"
                title="Delete"
                leftIcon={<TrashIcon size={18} />}
              />
              <Button
                variant="outline"
                title="Next"
                rightIcon={<ArrowRightIcon size={18} />}
              />
            </View>
          </View>

          {/* Buttons - sizes */}
          <View className="gap-6">
            <Text variant="heading">Button Sizes</Text>

            <View className="flex-row items-center gap-4 border-b border-border py-5">
              <Button variant="primary" size="sm" title="Small" />
              <Button variant="primary" size="default" title="Default" />
              <Button variant="primary" size="lg" title="Large" />
            </View>
          </View>

          {/* Buttons - full width */}
          <View className="gap-6">
            <Text variant="heading">Full Width</Text>

            <View className="gap-3 py-5">
              <Button variant="primary" title="Continue with Email" fullWidth />
              <Button
                variant="outline"
                title="Continue with Google"
                fullWidth
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
