import { View } from "react-native";
import { Link } from "expo-router";

import { Container } from "@/src/shared/layout/Container";
import { Text } from "@/src/shared/ui";

const SECTIONS = [
  {
    title: "Logo",
    description: "Brand mark in multiple sizes",
    href: "/design-system/logo",
  },
  {
    title: "Colors",
    description: "Semantic color tokens for light and dark mode",
    href: "/design-system/colors",
  },
  {
    title: "Text",
    description: "Typography scale from display to caption",
    href: "/design-system/text",
  },
  {
    title: "Buttons",
    description: "Variants, sizes, icon buttons, loading and disabled states",
    href: "/design-system/buttons",
  },
  {
    title: "Inputs",
    description: "Text fields with error, success, and password states",
    href: "/design-system/inputs",
  },
  {
    title: "Switch",
    description: "Toggle control with enabled, disabled, and label states",
    href: "/design-system/switch",
  },
  {
    title: "Modal",
    description: "Dismissible dialog with optional footer actions",
    href: "/design-system/modal",
  },
  {
    title: "Pill Tabs",
    description: "Horizontal pill tabs for navigation and filter selection",
    href: "/design-system/pilltabs",
  },
  {
    title: "Avatar",
    description: "Image, initial-letter, and generic-icon fallback chain",
    href: "/design-system/avatar",
  },
  {
    title: "Avatar Picker",
    description: "Pick, preview, and remove a profile image with upload states",
    href: "/design-system/avatarpicker",
  },
  {
    title: "Currency Picker",
    description: "Searchable country/currency picker in a modal sheet",
    href: "/design-system/currencypicker",
  },
  {
    title: "Date Field",
    description: "Native date picker input, styled to match text fields",
    href: "/design-system/datefield",
  },
  {
    title: "Star Rating",
    description: "Tap-to-rate stars, 1 to 5, filled up to the selected value",
    href: "/design-system/starrating",
  },
  {
    title: "Spinner",
    description: "Loading indicator in small and large sizes",
    href: "/design-system/spinner",
  },
] as const;

export default function DesignOverview() {
  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-10">
        <View className="gap-2">
          <Text variant="title">Cashevide Design System</Text>
          <Text variant="body" className="text-muted-foreground">
            Reference for colors, typography, and reusable UI components used
            across the app.
          </Text>
        </View>

        <View className="gap-3">
          {SECTIONS.map((section) => (
            <Link key={section.title} href={section.href as any} asChild>
              <View className="bg-card border border-border rounded-lg p-4 gap-1">
                <Text variant="body-lg" className="font-semibold">
                  {section.title}
                </Text>
                <Text variant="body-sm" className="text-muted-foreground">
                  {section.description}
                </Text>
              </View>
            </Link>
          ))}
        </View>
      </View>
    </Container>
  );
}
