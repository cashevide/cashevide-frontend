import { router, usePathname } from "expo-router";

import { ROUTES } from "@/src/shared/navigation/routes";
import { PillTabs, type PillTabItem } from "@/src/shared/ui";

const TABS: (PillTabItem & {
  href: typeof ROUTES.profile.home | typeof ROUTES.profile.business;
})[] = [
  { key: "personal", label: "Personal", href: ROUTES.profile.home },
  { key: "business", label: "Business", href: ROUTES.profile.business },
];

export default function ProfileSubTabs() {
  const pathname = usePathname();

  const activeKey =
    TABS.find((tab) => tab.href === pathname)?.key ?? "personal";

  function handleSelect(key: string) {
    const tab = TABS.find((t) => t.key === key);
    if (tab) {
      router.push(tab.href);
    }
  }

  return (
    <PillTabs
      items={TABS}
      activeKey={activeKey}
      onSelect={handleSelect}
      centered
      variant="segmented"
    />
  );
}
