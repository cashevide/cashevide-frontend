import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useUpdateInvoice } from "../hooks/useUpdateInvoice";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Input,
  Button,
  Spinner,
  PillTabs,
  CurrencyPicker,
  DateField,
} from "@/src/shared/ui";
import ClientPickerModal from "../components/ClientPickerModal";
import InvoiceItemFormRow from "../components/InvoiceItemFormRow";
import InvoicePaymentFormRow from "../components/InvoicePaymentFormRow";
import InvoicePreview from "../components/InvoicePreview";

import type { Client } from "@/src/features/clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type { PaymentRecordRequest } from "../types/paymentTypes";
import type {
  CreateInvoiceError,
  InvoiceTemplate,
  UpdateInvoiceRequest,
} from "../types/invoiceTypes";
import type { InvoicePreviewData } from "../components/InvoicePreview";

type Section = "details" | "payments";

const SECTION_TABS = [
  { key: "details", label: "Details & Items" },
  { key: "payments", label: "Payments" },
];

// Display-only label for the locked template — backend rejects any PUT
// that changes this value ("Template cannot be changed once the invoice
// is created."), so this screen never lets it be edited.
const TEMPLATE_LABEL: Record<InvoiceTemplate, string> = {
  classic: "Classic",
  standard: "Standard",
};

function extractErrorMessage(error: CreateInvoiceError): string {
  if (Array.isArray(error)) {
    return error.join("\n");
  }

  const messages: string[] = [];

  for (const [field, value] of Object.entries(error)) {
    if (field === "items" || field === "payments") {
      continue;
    }
    if (Array.isArray(value)) {
      messages.push(`${field}: ${value.join(", ")}`);
    }
  }

  return messages.length > 0
    ? messages.join("\n")
    : "Something went wrong. Please check your entries and try again.";
}

function createEmptyItem(): InvoiceItemRequest {
  return {
    product: null,
    title: "",
    description: "",
    quantity: "1",
    unit_type: "QTY",
    unit_price: "",
  };
}

function createEmptyPayment(): PaymentRecordRequest {
  return {
    amount: "",
    payment_date: "",
    payment_method: "",
    note: "",
  };
}

// Same client-side "live running total" preview math as CreateInvoiceScreen
// — the backend recomputes subtotal/total_amount from what it actually
// saves and is always the source of truth. This only mirrors it while
// the person is still editing.
function calculateItemTotal(item: InvoiceItemRequest): number {
  const quantity = parseFloat(item.quantity ?? "0");
  const unitPrice = parseFloat(item.unit_price ?? "0");
  if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) {
    return 0;
  }
  return quantity * unitPrice;
}

export default function EditInvoiceScreen() {
  const { invoiceId, section } = useLocalSearchParams<{
    invoiceId: string;
    section?: string;
  }>();
  const id = Number(invoiceId);
  const { width } = useWindowDimensions();
  // Same 768px breakpoint used across the app (see CreateInvoiceScreen,
  // InvoiceDetailsScreen).
  const isDesktopLayout = width >= 768;

  const invoiceDetails = useInvoiceDetails(id, { enabled: !Number.isNaN(id) });
  const updateInvoice = useUpdateInvoice();

  const [activeSection, setActiveSection] = useState<Section>(
    section === "payments" ? "payments" : "details",
  );

  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [issueDate, setIssueDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<InvoiceItemRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecordRequest[]>([]);
  // Locked at load time — never exposed as an editable field, only ever
  // read back and sent unchanged in the PUT payload (see handleSubmit).
  const [template, setTemplate] = useState<InvoiceTemplate>("classic");

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (invoiceDetails.data && !formInitialized) {
      const invoice = invoiceDetails.data;

      setSelectedClientId(invoice.client);
      setName(invoice.name);
      setEmail(invoice.email);
      setPhone(invoice.phone);
      setAddress(invoice.address);
      setCurrency(invoice.currency);
      setIssueDate(invoice.issue_date ?? undefined);
      setDueDate(invoice.due_date ?? undefined);
      setDiscount(invoice.discount);
      setTemplate(invoice.template);

      setItems(
        invoice.items.map((item) => ({
          id: item.id,
          product: item.product,
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unit_type: item.unit_type,
          unit_price: item.unit_price,
        })),
      );

      setPayments(
        invoice.payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          payment_method: payment.payment_method,
          note: payment.note,
        })),
      );

      setFormInitialized(true);
    }
  }, [invoiceDetails.data, formInitialized]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + calculateItemTotal(item), 0),
    [items],
  );
  const discountValue = parseFloat(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);

  // Live draft preview built from current form state. amount_paid /
  // balance_due are NOT recalculated here — they stay pinned to the
  // originally loaded invoice, since accurately deriving them from
  // in-progress payment edits would require replicating backend payment-
  // allocation logic on the client. The backend is the source of truth
  // for those two fields once the form is actually saved.
  const draftPreview: InvoicePreviewData | null = useMemo(() => {
    if (!invoiceDetails.data) {
      return null;
    }

    return {
      invoice_number: invoiceDetails.data.invoice_number,
      status: invoiceDetails.data.status,
      template,
      currency,
      issue_date: issueDate,
      due_date: dueDate,
      name: name || "Untitled Client",
      email,
      phone,
      address,
      items: items.map((item, index) => ({
        id: item.id ?? `draft-${index}`,
        title: item.title ?? "",
        quantity: item.quantity ?? "",
        unit_price: item.unit_price ?? "",
        total: calculateItemTotal(item).toFixed(2),
      })),
      subtotal: subtotal.toFixed(2),
      discount: discountValue.toFixed(2),
      total_amount: total.toFixed(2),
      amount_paid: invoiceDetails.data.amount_paid,
      balance_due: invoiceDetails.data.balance_due,
    };
  }, [
    invoiceDetails.data,
    template,
    currency,
    issueDate,
    dueDate,
    name,
    email,
    phone,
    address,
    items,
    subtotal,
    discountValue,
    total,
  ]);

  if (Number.isNaN(id)) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              Invalid invoice.
            </Text>
          </View>
        </Container>
      </View>
    );
  }

  if (invoiceDetails.isLoading || !formInitialized) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              This invoice could not be found.
            </Text>
          </View>
        </Container>
      </View>
    );
  }

  function handleSelectClient(client: Client) {
    setSelectedClientId(client.id);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
  }

  function handleClearClient() {
    setSelectedClientId(null);
  }

  function handleAddItem() {
    setItems((prev) => [...prev, createEmptyItem()]);
  }

  function handleItemChange(index: number, updatedItem: InvoiceItemRequest) {
    setItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? updatedItem : item)),
    );
  }

  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleAddPayment() {
    setPayments((prev) => [...prev, createEmptyPayment()]);
  }

  function handlePaymentChange(
    index: number,
    updatedPayment: PaymentRecordRequest,
  ) {
    setPayments((prev) =>
      prev.map((payment, paymentIndex) =>
        paymentIndex === index ? updatedPayment : payment,
      ),
    );
  }

  function handleRemovePayment(index: number) {
    setPayments((prev) =>
      prev.filter((_, paymentIndex) => paymentIndex !== index),
    );
  }

  function handleSubmit() {
    if (selectedClientId == null && !name.trim()) {
      Alert.alert(
        "Client required",
        "Select an existing client or enter a client name.",
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert("Items required", "Add at least one item to the invoice.");
      return;
    }

    for (const item of items) {
      if (!item.product && (!item.title?.trim() || !item.unit_price)) {
        Alert.alert(
          "Incomplete item",
          "Each item needs a product selected, or a title and unit price entered manually.",
        );
        return;
      }
    }

    for (const payment of payments) {
      if (!payment.amount || !payment.payment_date) {
        Alert.alert(
          "Incomplete payment",
          "Each payment needs an amount and a payment date.",
        );
        return;
      }
    }

    const payload: UpdateInvoiceRequest = {
      client: selectedClientId,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      currency: currency || undefined,
      issue_date: issueDate ?? null,
      due_date: dueDate ?? null,
      discount: discount || "0",
      // Always the same value loaded from the invoice — the backend
      // rejects any change to this field after creation.
      template,
      items,
      payments,
    };

    updateInvoice.mutate(
      { id, payload },
      {
        onSuccess: () => {
          router.replace(ROUTES.invoices.detail(id));
        },
        onError: (error) => {
          const responseData = (
            error as { response?: { data?: CreateInvoiceError } }
          )?.response?.data;

          Alert.alert(
            "Could not update invoice",
            responseData
              ? extractErrorMessage(responseData)
              : "Something went wrong. Please try again.",
          );
        },
      },
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={invoiceDetails.data.invoice_number}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View
          className={cn(
            "px-6 py-6 gap-8 pb-32",
            isDesktopLayout && "flex-row items-start gap-8",
          )}
        >
          {/* -------------------- Form column -------------------- */}
          <View className={cn("gap-6", isDesktopLayout && "flex-1")}>
            <PillTabs
              items={SECTION_TABS}
              activeKey={activeSection}
              onSelect={(key) => setActiveSection(key as Section)}
            />

            {activeSection === "details" && (
              <>
                {/* -------------------- Template (locked) -------------------- */}
                <View className="gap-1">
                  <Text variant="subheading">Template</Text>
                  <View className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
                    <Text variant="body-sm">{TEMPLATE_LABEL[template]}</Text>
                    <Text variant="caption" className="text-muted-foreground">
                      Locked after creation
                    </Text>
                  </View>
                </View>

                {/* -------------------- Client -------------------- */}
                <View className="gap-3">
                  <Text variant="subheading">Client</Text>

                  {selectedClientId != null ? (
                    <View className="flex-row items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                      <View className="flex-1 gap-0.5">
                        <Text variant="body" className="font-semibold">
                          {name}
                        </Text>
                      </View>
                      <Pressable onPress={handleClearClient}>
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground"
                        >
                          Clear
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Button
                      variant="outline"
                      title="Select from existing clients"
                      onPress={() => setClientPickerVisible(true)}
                    />
                  )}

                  <Input
                    placeholder="Client name"
                    value={name}
                    onChangeText={setName}
                  />
                  <Input
                    placeholder="Email (optional)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Input
                    placeholder="Phone (optional)"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <Input
                    placeholder="Address (optional)"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>

                {/* -------------------- Invoice details -------------------- */}
                <View className="gap-3">
                  <Text variant="subheading">Invoice Details</Text>

                  <View className="gap-1">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Currency
                    </Text>
                    <CurrencyPicker value={currency} onChange={setCurrency} />
                  </View>

                  <View className="flex-row gap-3">
                    <DateField
                      label="Issue date"
                      value={issueDate}
                      onChange={setIssueDate}
                      placeholder="Not set"
                    />
                    <DateField
                      label="Due date"
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="Not set"
                    />
                  </View>
                </View>

                {/* -------------------- Items -------------------- */}
                <View className="gap-3">
                  <Text variant="subheading">Items</Text>

                  <View className="gap-3">
                    {items.map((item, index) => (
                      <InvoiceItemFormRow
                        key={index}
                        item={item}
                        onChange={(updatedItem) =>
                          handleItemChange(index, updatedItem)
                        }
                        onRemove={() => handleRemoveItem(index)}
                        canRemove={items.length > 1}
                      />
                    ))}
                  </View>

                  <Button
                    variant="outline"
                    title="+ Add Item"
                    onPress={handleAddItem}
                  />
                </View>

                {/* -------------------- Discount -------------------- */}
                <View className="gap-3">
                  <Text variant="subheading">Discount</Text>
                  <Input
                    placeholder="0"
                    keyboardType="decimal-pad"
                    value={discount}
                    onChangeText={setDiscount}
                  />

                  {/* Mirrors CreateInvoiceScreen: on mobile there's no
                      side-by-side preview for the running total, so this
                      summary card stays as the only place to see it. */}
                  {!isDesktopLayout && (
                    <View className="gap-2 rounded-lg border border-border bg-card p-4">
                      <View className="flex-row items-center justify-between">
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground"
                        >
                          Subtotal
                        </Text>
                        <Text variant="body-sm">
                          {currency} {subtotal.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground"
                        >
                          Discount
                        </Text>
                        <Text variant="body-sm">
                          -{currency} {discountValue.toFixed(2)}
                        </Text>
                      </View>
                      <View className="h-px bg-border" />
                      <View className="flex-row items-center justify-between">
                        <Text variant="body" className="font-semibold">
                          Total
                        </Text>
                        <Text variant="body" className="font-semibold">
                          {currency} {total.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            {activeSection === "payments" && (
              <View className="gap-3">
                <Text variant="subheading">Payments</Text>

                <View className="gap-3">
                  {payments.map((payment, index) => (
                    <InvoicePaymentFormRow
                      key={index}
                      payment={payment}
                      onChange={(updatedPayment) =>
                        handlePaymentChange(index, updatedPayment)
                      }
                      onRemove={() => handleRemovePayment(index)}
                    />
                  ))}
                </View>

                <Button
                  variant="outline"
                  title="+ Add Payment"
                  onPress={handleAddPayment}
                />
              </View>
            )}
          </View>

          {/* -------------------- Live preview column (desktop only) -------------------- */}
          {isDesktopLayout && draftPreview && (
            <View className="w-[380px]">
              <InvoicePreview invoice={draftPreview} />
            </View>
          )}
        </View>
      </Container>

      {/* -------------------- Sticky bottom submit -------------------- */}
      <View className="w-full border-t border-border bg-background">
        <View className="w-full max-w-desktop mx-auto">
          <View className="flex-row items-center justify-end gap-4 px-6 py-4">
            <Button
              variant="primary"
              title="Save Changes"
              onPress={handleSubmit}
              isLoading={updateInvoice.isPending}
            />
          </View>
        </View>
      </View>

      <ClientPickerModal
        visible={clientPickerVisible}
        onSelect={handleSelectClient}
        onDismiss={() => setClientPickerVisible(false)}
      />
    </View>
  );
}
