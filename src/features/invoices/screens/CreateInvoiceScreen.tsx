import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Input,
  Button,
  Spinner,
  CurrencyPicker,
  DateField,
} from "@/src/shared/ui";
import ClientPickerModal from "../components/ClientPickerModal";
import InvoiceItemFormRow from "../components/InvoiceItemFormRow";
import InvoicePreview from "../components/InvoicePreview";

import type { Client } from "@/src/features/clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type {
  CreateInvoiceError,
  CreateInvoiceRequest,
} from "../types/invoiceTypes";
import type { InvoicePreviewData } from "../components/InvoicePreview";

function isBusinessProfileComplete(profile: {
  business_name: string;
  logo: string | null;
  address: string;
}): boolean {
  return (
    profile.business_name.trim().length > 0 &&
    profile.logo != null &&
    profile.address.trim().length > 0
  );
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

// Client-side preview only — the backend recomputes subtotal/total_amount
// from the items it actually saves and is always the source of truth.
// This just gives the person a live running total while they type,
// mirroring the "keep pricing visible while filling in details" pattern
// used by mobile checkout flows.
function calculateItemTotal(item: InvoiceItemRequest): number {
  const quantity = parseFloat(item.quantity ?? "0");
  const unitPrice = parseFloat(item.unit_price ?? "0");
  if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) {
    return 0;
  }
  return quantity * unitPrice;
}

function formatAmount(amount: number, currency: string): string {
  return `${currency ? currency + " " : ""}${amount.toFixed(2)}`;
}

export default function CreateInvoiceScreen() {
  const businessProfile = useBusinessProfile();
  const createInvoice = useCreateInvoice();
  const { width } = useWindowDimensions();
  // Same 768px breakpoint used across the app (see InvoiceListScreen) —
  // below it there isn't room for form + preview side by side, so the
  // preview is hidden entirely rather than squeezed into an unreadable
  // column.
  const isDesktopLayout = width >= 768;

  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [issueDate, setIssueDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<InvoiceItemRequest[]>([createEmptyItem()]);

  const [currencyInitialized, setCurrencyInitialized] = useState(false);

  useEffect(() => {
    if (businessProfile.data?.currency && !currencyInitialized) {
      setCurrency(businessProfile.data.currency);
      setCurrencyInitialized(true);
    }
  }, [businessProfile.data, currencyInitialized]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + calculateItemTotal(item), 0),
    [items],
  );
  const discountValue = parseFloat(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);

  // Client-only preview state, rebuilt from live form state on every
  // render — this is never sent to the backend, purely a "what the
  // invoice will roughly look like" view while the person is still
  // filling in the form. No id/invoice_number/status yet, since the
  // invoice doesn't exist on the server until submit succeeds.
  const draftPreview: InvoicePreviewData = useMemo(
    () => ({
      currency,
      issue_date: issueDate,
      due_date: dueDate,
      name: selectedClient?.name || name || "Untitled Client",
      email: selectedClient?.email || email,
      phone: selectedClient?.phone || phone,
      address: selectedClient?.address || address,
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
    }),
    [
      currency,
      issueDate,
      dueDate,
      selectedClient,
      name,
      email,
      phone,
      address,
      items,
      subtotal,
      discountValue,
      total,
    ],
  );

  if (businessProfile.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="New Invoice"
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

  if (
    !businessProfile.data ||
    !isBusinessProfileComplete(businessProfile.data)
  ) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="New Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center gap-3 px-6">
            <Text variant="subheading" className="text-center">
              Complete Your Business Profile
            </Text>
            <Text
              variant="body-sm"
              className="text-center text-muted-foreground"
            >
              Add your business name, logo, and address before creating an
              invoice — this information appears on every invoice you send.
            </Text>
            <View className="mt-2">
              <Button
                variant="primary"
                title="Complete Business Profile"
                onPress={() => router.push("/profile/business-edit")}
              />
            </View>
          </View>
        </Container>
      </View>
    );
  }

  function handleSelectClient(client: Client) {
    setSelectedClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
  }

  function handleClearClient() {
    setSelectedClient(null);
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

  function handleSubmit() {
    if (!selectedClient && !name.trim()) {
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

    const payload: CreateInvoiceRequest = {
      client: selectedClient?.id ?? null,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      currency: currency || undefined,
      issue_date: issueDate ?? null,
      due_date: dueDate ?? null,
      discount: discount || "0",
      items,
      payments: [],
    };

    createInvoice.mutate(payload, {
      onSuccess: (data) => {
        router.replace(ROUTES.invoices.detail(data.id));
      },
      onError: (error) => {
        const responseData = (
          error as { response?: { data?: CreateInvoiceError } }
        )?.response?.data;

        Alert.alert(
          "Could not create invoice",
          responseData
            ? extractErrorMessage(responseData)
            : "Something went wrong. Please try again.",
        );
      },
    });
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="New Invoice"
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
          <View className={cn("gap-8", isDesktopLayout && "flex-1")}>
            {/* -------------------- Client -------------------- */}
            <View className="gap-3">
              <Text variant="subheading">Client</Text>

              {selectedClient ? (
                <View className="flex-row items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                  <View className="flex-1 gap-0.5">
                    <Text variant="body" className="font-semibold">
                      {selectedClient.name}
                    </Text>
                    <Text variant="body-sm" className="text-muted-foreground">
                      {selectedClient.phone}
                    </Text>
                  </View>
                  <Pressable onPress={handleClearClient}>
                    <Text variant="body-sm" className="text-muted-foreground">
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
                />
                <DateField
                  label="Due date"
                  value={dueDate}
                  onChange={setDueDate}
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

              {/* On mobile there's no side-by-side preview to show the
                  running total, so this summary card stays as the only
                  place to see it. On desktop the preview column covers
                  the same numbers, so it's dropped here to avoid
                  showing the same total twice. */}
              {!isDesktopLayout && (
                <View className="gap-2 rounded-lg border border-border bg-card p-4">
                  <View className="flex-row items-center justify-between">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Subtotal
                    </Text>
                    <Text variant="body-sm">
                      {formatAmount(subtotal, currency)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Discount
                    </Text>
                    <Text variant="body-sm">
                      -{formatAmount(discountValue, currency)}
                    </Text>
                  </View>
                  <View className="h-px bg-border" />
                  <View className="flex-row items-center justify-between">
                    <Text variant="body" className="font-semibold">
                      Total
                    </Text>
                    <Text variant="body" className="font-semibold">
                      {formatAmount(total, currency)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* -------------------- Live preview column (desktop only) -------------------- */}
          {isDesktopLayout && (
            <View className="w-[380px]">
              <InvoicePreview invoice={draftPreview} />
            </View>
          )}
        </View>
      </Container>

      {/* -------------------- Sticky bottom summary + submit -------------------- */}
      <View className="w-full border-t border-border bg-background">
        <View className="w-full max-w-desktop mx-auto">
          <View className="flex-row items-center gap-4 px-6 py-4">
            <View className="flex-1 gap-0.5">
              <Text variant="caption">Total</Text>
              <Text variant="body-lg" className="font-semibold">
                {formatAmount(total, currency)}
              </Text>
            </View>

            <Button
              variant="primary"
              title="Create Invoice"
              onPress={handleSubmit}
              isLoading={createInvoice.isPending}
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
