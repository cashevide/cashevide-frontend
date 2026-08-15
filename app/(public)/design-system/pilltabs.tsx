import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, PillTabs } from "@/src/shared/ui";

const SECTION_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "invoices", label: "Invoices" },
  { key: "clients", label: "Clients" },
  { key: "products", label: "Products" },
];

const CURRENCY_TABS = [
  { key: "INR", label: "INR" },
  { key: "USD", label: "USD" },
  { key: "EUR", label: "EUR" },
];

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "unpaid", label: "Unpaid" },
  { key: "partially_paid", label: "Partially Paid" },
  { key: "paid", label: "Paid" },
];

export default function DesignPillTabs() {
  const [section, setSection] = useState("dashboard");
  const [currency, setCurrency] = useState("INR");
  const [status, setStatus] = useState("all");

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-10">
        <Text variant="title">Pill Tabs</Text>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Navigation — e.g. Invoices tab's Dashboard / Invoices / Clients /
            Products sections
          </Text>
          <PillTabs
            items={SECTION_TABS}
            activeKey={section}
            onSelect={setSection}
          />
        </View>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Filter/selection — e.g. currency switcher on the invoice dashboard
          </Text>
          <PillTabs
            items={CURRENCY_TABS}
            activeKey={currency}
            onSelect={setCurrency}
          />
        </View>

        <View className="gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Longer list, horizontally scrollable — e.g. invoice status filter
          </Text>
          <PillTabs
            items={STATUS_TABS}
            activeKey={status}
            onSelect={setStatus}
          />
        </View>
      </View>
    </Container>
  );
}
