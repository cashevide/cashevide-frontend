import type { Href } from "expo-router";
import {
  HomeIcon as HomeIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  UserIcon as UserIconOutline,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  UserIcon as UserIconSolid,
} from "react-native-heroicons/solid";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import { ROUTES } from "./routes";

export type AppTabName = "reviews" | "invoices" | "settings" | "profile";

type IconComponent = ComponentType<SvgProps>;

export interface AppTabConfig {
  name: AppTabName;
  href: Href;
  label: string;
  iconOutline: IconComponent;
  iconSolid: IconComponent;
}

// Order here drives the order tabs render in, both in the mobile bottom
// bar and the desktop sidebar.
export const APP_TABS: AppTabConfig[] = [
  {
    name: "reviews",
    href: ROUTES.reviews.home,
    label: "Reviews",
    iconOutline: HomeIconOutline,
    iconSolid: HomeIconSolid,
  },
  {
    name: "invoices",
    href: ROUTES.invoices.dashboard,
    label: "Invoices",
    iconOutline: DocumentTextIconOutline,
    iconSolid: DocumentTextIconSolid,
  },
  {
    name: "settings",
    href: ROUTES.settings.home,
    label: "Settings",
    iconOutline: Cog6ToothIconOutline,
    iconSolid: Cog6ToothIconSolid,
  },
  {
    name: "profile",
    href: ROUTES.profile.home,
    label: "Profile",
    iconOutline: UserIconOutline,
    iconSolid: UserIconSolid,
  },
];
