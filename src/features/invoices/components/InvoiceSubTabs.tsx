import { router, usePathname } from "expo-router";
import type { Href } from "expo-router";

import { ROUTES } from "@/src/shared/navigation/routes";
import { PillTabs, type PillTabItem } from "@/src/shared/ui";

const TABS: (PillTabItem & { href: Href })[] = [
  { key: "dashboard", label: "Dashboard", href: ROUTES.invoices.dashboard },
  { key: "invoices", label: "Invoices", href: ROUTES.invoices.list },
  { key: "clients", label: "Clients", href: ROUTES.invoices.clients.list },
  { key: "products", label: "Products", href: ROUTES.invoices.products.list },
];

export default function InvoiceSubTabs() {
  const pathname = usePathname();

  // Exact match only — each of these routes is a genuine sibling screen
  // (not nested under one another the way a tab's own sub-pages are), so
  // there's no need for the prefix-matching AppShell's bottom bar does.
  const activeKey =
    TABS.find((tab) => tab.href === pathname)?.key ?? "dashboard";

  function handleSelect(key: string) {
    const tab = TABS.find((t) => t.key === key);
    if (tab) {
      router.push(tab.href);
    }
  }

  return (
    <PillTabs items={TABS} activeKey={activeKey} onSelect={handleSelect} />
  );
}
