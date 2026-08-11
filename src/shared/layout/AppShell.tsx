import { Pressable, View, useWindowDimensions } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/src/shared/utils/cn";
import { Text, Avatar } from "@/src/shared/ui";
import { useThemeStore } from "@/src/store/themeStore";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { APP_TABS } from "@/src/shared/navigation/appTabs";

const DESKTOP_BREAKPOINT = 768;
const SIDEBAR_WIDTH = 200;
const MOBILE_TAB_SIZE = 44; // h-11 / w-11
const MOBILE_BAR_WIDTH_FRACTION = 0.62; // how much of the screen width the bar spans
const MOBILE_BAR_INNER_PADDING = 6; // p-1.5 inside the pill bar

// TabTrigger forwards `isFocused` (and the rest of Pressable's props) to
// whatever we pass via `asChild` — this lets a single button component
// react to its own selected state without any external active-tab logic.
// Named `tabPosition` (not `tabIndex`) because Pressable already has a
// web-only `tabIndex` accessibility prop typed as `0 | -1` — reusing that
// name collided with our own `number` index and broke the types.
type TabButtonProps = TabTriggerSlotProps & {
  tabPosition: number;
  // Only populated for the profile tab's button — passed down from
  // AppShell (which owns the single useUserProfile() call) rather than
  // each button fetching it independently.
  profile?: { fullName: string | null; profilePicture: string | null };
};

function MobileTabButton({
  tabPosition,
  isFocused,
  profile,
  ...props
}: TabButtonProps) {
  const tab = APP_TABS[tabPosition];
  const Icon = tab.iconOutline;
  const isProfileTab = tab.name === "profile";

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isFocused }}
      style={{ height: MOBILE_TAB_SIZE }}
      className="flex-1 items-center justify-center rounded-full"
    >
      {isProfileTab ? (
        <Avatar
          imageUri={profile?.profilePicture}
          name={profile?.fullName}
          size={20}
        />
      ) : (
        <Icon
          width={22}
          height={22}
          color={
            isFocused
              ? "rgb(var(--color-foreground))"
              : "rgb(var(--color-muted-foreground))"
          }
        />
      )}
    </Pressable>
  );
}

function DesktopTabButton({
  tabPosition,
  isFocused,
  profile,
  ...props
}: TabButtonProps) {
  const tab = APP_TABS[tabPosition];
  const Icon = tab.iconOutline;
  const isProfileTab = tab.name === "profile";

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isFocused }}
      className={cn(
        "w-full flex-row items-center gap-3 rounded-lg px-3 py-2.5",
        isFocused && "bg-foreground/10",
      )}
    >
      {isProfileTab ? (
        <Avatar
          imageUri={profile?.profilePicture}
          name={profile?.fullName}
          size={18}
        />
      ) : (
        <Icon
          width={20}
          height={20}
          color={
            isFocused
              ? "rgb(var(--color-foreground))"
              : "rgb(var(--color-muted-foreground))"
          }
        />
      )}
      <Text
        variant="body-sm"
        style={{ textAlign: "left" }}
        className={cn(
          "flex-1",
          isFocused ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

function MobileTabBar() {
  const insets = useSafeAreaInsets();
  const theme = useThemeStore((state) => state.theme);
  const pathname = usePathname();
  const { width: screenWidth } = useWindowDimensions();
  const { data: userProfile } = useUserProfile();

  // Exact match for a tab's own root ("/reviews"), or prefix match for
  // any screen nested under it ("/reviews/add") — otherwise switching
  // to a sub-screen would leave the pill on no tab at all.
  const activeIndex = APP_TABS.findIndex((tab) => {
    const tabPath = String(tab.href);
    return pathname === tabPath || pathname.startsWith(`${tabPath}/`);
  });

  // Bar spans a fraction of the screen instead of edge-to-edge — with
  // only 4 icon-only tabs, a full-width bar looked sparse/empty.
  const barWidth = screenWidth * MOBILE_BAR_WIDTH_FRACTION;
  const barInnerWidth = barWidth - MOBILE_BAR_INNER_PADDING * 2;
  const slotWidth = barInnerWidth / APP_TABS.length;

  const pillStyle = useAnimatedStyle(() => ({
    width: slotWidth,
    transform: [
      {
        translateX: withTiming(Math.max(activeIndex, 0) * slotWidth, {
          duration: 220,
        }),
      },
    ],
    opacity: activeIndex === -1 ? 0 : 1,
  }));

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center"
      style={{ bottom: insets.bottom + 12 }}
    >
      <View
        style={{ width: barWidth }}
        className="flex-row items-center rounded-full border border-border p-1.5 overflow-hidden"
      >
        <BlurView
          intensity={80}
          tint={theme === "dark" ? "dark" : "light"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: MOBILE_BAR_INNER_PADDING,
              left: MOBILE_BAR_INNER_PADDING,
              height: MOBILE_TAB_SIZE,
            },
            pillStyle,
          ]}
        >
          <View className="h-full w-full rounded-full bg-foreground/10" />
        </Animated.View>

        {APP_TABS.map((tab, index) => (
          <TabTrigger key={tab.name} name={tab.name} asChild>
            <MobileTabButton
              tabPosition={index}
              profile={
                userProfile
                  ? {
                      fullName: userProfile.full_name,
                      profilePicture: userProfile.profile_picture,
                    }
                  : undefined
              }
            />
          </TabTrigger>
        ))}
      </View>
    </View>
  );
}

function DesktopSidebar() {
  const { data: userProfile } = useUserProfile();

  return (
    <View
      style={{ width: SIDEBAR_WIDTH }}
      className="h-full gap-1 border-r border-border bg-background px-3 py-6"
    >
      {APP_TABS.map((tab, index) => (
        <TabTrigger key={tab.name} name={tab.name} asChild>
          <DesktopTabButton
            tabPosition={index}
            profile={
              userProfile
                ? {
                    fullName: userProfile.full_name,
                    profilePicture: userProfile.profile_picture,
                  }
                : undefined
            }
          />
        </TabTrigger>
      ))}
    </View>
  );
}

export function AppShell() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  return (
    <Tabs style={{ flex: 1 }}>
      {/* Defines the available tab routes. Hidden — MobileTabBar /
          DesktopSidebar below render the actual buttons via TabTrigger
          `asChild`, driven off the same tab names. */}
      <TabList style={{ display: "none" }}>
        {APP_TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>

      <View className="flex-1 flex-row bg-background">
        {isDesktop && <DesktopSidebar />}

        <View className="flex-1">
          <TabSlot />
        </View>
      </View>

      {!isDesktop && <MobileTabBar />}
    </Tabs>
  );
}
