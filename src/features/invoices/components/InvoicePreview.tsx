import { Image, StyleSheet, Text, View } from "react-native";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

import type { Invoice } from "../types/invoiceTypes";

type InvoicePreviewProps = {
  invoice: Invoice;
};

function formatMoney(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const businessProfile = useBusinessProfile();

  const hasLogo = !!businessProfile.data?.logo;
  const hasBusinessAddress = !!businessProfile.data?.address;
  const hasBusinessPhone = !!businessProfile.data?.phone_number;
  const hasEmail = !!invoice.email;
  const hasPhone = !!invoice.phone;
  const hasAddress = !!invoice.address;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.businessInfo}>
          {hasLogo && (
            <Image
              source={{ uri: businessProfile.data?.logo ?? undefined }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <View>
            <Text style={styles.businessName}>
              {businessProfile.data?.business_name || "Your Business"}
            </Text>
            {hasBusinessAddress && (
              <Text style={styles.businessMeta}>
                {businessProfile.data?.address}
              </Text>
            )}
            {hasBusinessPhone && (
              <Text style={styles.businessMeta}>
                {businessProfile.data?.phone_number}
              </Text>
            )}
          </View>
        </View>

        <InvoiceStatusBadge status={invoice.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View>
          <Text style={styles.metaLabel}>Invoice Number</Text>
          <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Issue Date</Text>
          <Text style={styles.metaValue}>{invoice.issue_date ?? "—"}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Due Date</Text>
          <Text style={styles.metaValue}>{invoice.due_date ?? "—"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Bill To</Text>
      <Text style={styles.billToName}>{invoice.name || "Untitled Client"}</Text>
      {hasEmail && <Text style={styles.billToMeta}>{invoice.email}</Text>}
      {hasPhone && <Text style={styles.billToMeta}>{invoice.phone}</Text>}
      {hasAddress && <Text style={styles.billToMeta}>{invoice.address}</Text>}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Items</Text>
      <View style={styles.itemsHeaderRow}>
        <Text style={[styles.itemsHeaderText, styles.itemTitleCol]}>
          Description
        </Text>
        <Text style={[styles.itemsHeaderText, styles.itemQtyCol]}>Qty</Text>
        <Text style={[styles.itemsHeaderText, styles.itemPriceCol]}>Price</Text>
        <Text style={[styles.itemsHeaderText, styles.itemTotalCol]}>Total</Text>
      </View>

      {invoice.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={[styles.itemText, styles.itemTitleCol]}>
            {item.title}
          </Text>
          <Text style={[styles.itemText, styles.itemQtyCol]}>
            {item.quantity}
          </Text>
          <Text style={[styles.itemText, styles.itemPriceCol]}>
            {item.unit_price ?? "—"}
          </Text>
          <Text style={[styles.itemText, styles.itemTotalCol]}>
            {item.total}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalsBlock}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>
            {formatMoney(invoice.subtotal, invoice.currency)}
          </Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Discount</Text>
          <Text style={styles.totalsValue}>
            {formatMoney(invoice.discount, invoice.currency)}
          </Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabelBold}>Total</Text>
          <Text style={styles.totalsValueBold}>
            {formatMoney(invoice.total_amount, invoice.currency)}
          </Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Amount Paid</Text>
          <Text style={styles.totalsValue}>
            {formatMoney(invoice.amount_paid, invoice.currency)}
          </Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabelBold}>Balance Due</Text>
          <Text style={styles.totalsValueBold}>
            {formatMoney(invoice.balance_due, invoice.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  businessInfo: {
    flexDirection: "row",
    gap: 10,
    flexShrink: 1,
  },
  logo: {
    width: 40,
    height: 40,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  businessMeta: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaLabel: {
    fontSize: 11,
    color: "#999",
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 6,
  },
  billToName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  billToMeta: {
    fontSize: 12,
    color: "#666",
  },
  itemsHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },
  itemsHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#999",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemText: {
    fontSize: 13,
  },
  itemTitleCol: {
    flex: 2,
  },
  itemQtyCol: {
    flex: 1,
    textAlign: "right",
  },
  itemPriceCol: {
    flex: 1,
    textAlign: "right",
  },
  itemTotalCol: {
    flex: 1,
    textAlign: "right",
  },
  totalsBlock: {
    gap: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsLabel: {
    fontSize: 13,
    color: "#666",
  },
  totalsValue: {
    fontSize: 13,
  },
  totalsLabelBold: {
    fontSize: 14,
    fontWeight: "bold",
  },
  totalsValueBold: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
