import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { Link, Stack, usePathname } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Svg, { Rect, Path } from "react-native-svg";

import { Text, Switch, Logo } from "@/src/shared/ui";
import { useThemeStore } from "@/src/store/themeStore";

const NAV_ITEMS = [
  { label: "Overview", href: "/design-system" },
  { label: "Logo", href: "/design-system/logo" },
  { label: "Colors", href: "/design-system/colors" },
  { label: "Text", href: "/design-system/text" },
  { label: "Buttons", href: "/design-system/buttons" },
  { label: "Inputs", href: "/design-system/inputs" },
  { label: "Switch", href: "/design-system/switch" },
];

const SIDEBAR_OPEN_WIDTH = 240;
const SIDEBAR_CLOSED_WIDTH = 48;
const DESKTOP_BREAKPOINT = 768;

function SidebarToggleIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path d="M9 4v16" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export default function DesignLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= DESKTOP_BREAKPOINT;

  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const sidebarWidth = useSharedValue(
    isDesktop ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
  );

  function toggleSidebar() {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    sidebarWidth.value = withTiming(
      next ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
      { duration: 220 },
    );
  }

  const sidebarStyle = useAnimatedStyle(() => ({
    width: sidebarWidth.value,
  }));

  const sidebarContent = (
    <View className="border-r border-border py-4 h-full bg-background">
      <View
        className={`flex-row items-center mb-8 ${
          sidebarOpen ? "justify-between px-3" : "justify-center"
        }`}
      >
        {sidebarOpen && (
          <View className="px-3">
            <Logo width={36} />
          </View>
        )}

        <Pressable className="p-1" onPress={toggleSidebar}>
          <SidebarToggleIcon size={18} color="rgb(var(--color-foreground))" />
        </Pressable>
      </View>

      {sidebarOpen && (
        <View className="px-3 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  className={`px-3 py-2 rounded-md ${
                    isActive ? "bg-secondary" : ""
                  }`}
                  onPress={() => {
                    if (!isDesktop) {
                      setSidebarOpen(false);
                      sidebarWidth.value = withTiming(SIDEBAR_CLOSED_WIDTH, {
                        duration: 220,
                      });
                    }
                  }}
                >
                  <Text
                    variant="body-sm"
                    className={
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 flex-row bg-background">
      {isDesktop ? (
        <Animated.View style={sidebarStyle} className="overflow-hidden">
          {sidebarContent}
        </Animated.View>
      ) : (
        <>
          <View style={{ width: SIDEBAR_CLOSED_WIDTH }}>
            {!sidebarOpen && sidebarContent}
          </View>

          {sidebarOpen && (
            <Animated.View
              style={[
                sidebarStyle,
                {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  zIndex: 20,
                },
              ]}
              className="overflow-hidden"
            >
              {sidebarContent}
            </Animated.View>
          )}

          {sidebarOpen && (
            <Pressable
              className="absolute inset-0 bg-overlay/40 z-10"
              onPress={toggleSidebar}
            />
          )}
        </>
      )}

      <View className="flex-1">
        <View className="flex-row items-center justify-between px-8 h-16">
          <Text variant="body-lg" className="font-semibold">
            Design System
          </Text>

          <View className="flex-row items-center gap-4">
            <Text variant="body-sm">Dark mode</Text>
            <Switch
              value={theme === "dark"}
              onValueChange={(next) => setTheme(next ? "dark" : "light")}
              accessibilityLabel="Toggle dark mode"
            />
          </View>
        </View>

        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    </View>
  );
}
