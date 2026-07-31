import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useUpdateInvoice } from "../hooks/useUpdateInvoice";
import { ROUTES } from "@/src/shared/navigation/routes";
import { DateField } from "@/src/shared/ui";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import ClientPickerModal from "../components/ClientPickerModal";
import InvoiceItemFormRow from "../components/InvoiceItemFormRow";
import InvoicePaymentFormRow from "../components/InvoicePaymentFormRow";

import type { Client } from "@/src/features/clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type { PaymentRecordRequest } from "../types/paymentTypes";
import type {
  CreateInvoiceError,
  UpdateInvoiceRequest,
} from "../types/invoiceTypes";

type Section = "details" | "payments";

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

export default function EditInvoiceScreen() {
  const { invoiceId, section } = useLocalSearchParams<{
    invoiceId: string;
    section?: string;
  }>();
  const id = Number(invoiceId);

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
  const [issueDate, setIssueDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<InvoiceItemRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecordRequest[]>([]);

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (invoiceDetails.data && !formInitialized) {
      const invoice = invoiceDetails.data;

      setSelectedClientId(invoice.client);
      setName(invoice.name);
      setEmail(invoice.email);
      setPhone(invoice.phone);
      setAddress(invoice.address);
      setIssueDate(invoice.issue_date ?? undefined);
      setDueDate(invoice.due_date ?? undefined);
      setDiscount(invoice.discount);

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

  if (Number.isNaN(id)) {
    return (
      <View style={styles.centered}>
        <Text>Invalid invoice.</Text>
      </View>
    );
  }

  if (invoiceDetails.isLoading || !formInitialized) {
    return (
      <View style={styles.centered}>
        <Text>Loading invoice...</Text>
      </View>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <View style={styles.centered}>
        <Text>This invoice could not be found.</Text>
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
      issue_date: issueDate ?? null,
      due_date: dueDate ?? null,
      discount: discount || "0",
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InvoiceSubTabs />

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveSection("details")}>
          <Text
            style={
              activeSection === "details"
                ? styles.tabActive
                : styles.tabInactive
            }
          >
            Details & Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveSection("payments")}>
          <Text
            style={
              activeSection === "payments"
                ? styles.tabActive
                : styles.tabInactive
            }
          >
            Payments
          </Text>
        </TouchableOpacity>
      </View>

      {activeSection === "details" && (
        <>
          <Text style={styles.sectionTitle}>Client</Text>

          {selectedClientId != null ? (
            <View style={styles.selectedClientCard}>
              <Text style={styles.selectedClientName}>{name}</Text>
              <TouchableOpacity onPress={handleClearClient}>
                <Text style={styles.clearClientText}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.pickClientButton}
              onPress={() => setClientPickerVisible(true)}
            >
              <Text style={styles.pickClientButtonText}>
                Select from existing clients
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder="Client name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone (optional)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Address (optional)"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.dateRow}>
            <DateField
              label="Issue Date"
              value={issueDate}
              onChange={setIssueDate}
              placeholder="Not set"
            />
            <DateField
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              placeholder="Not set"
            />
          </View>

          <Text style={styles.sectionTitle}>Items</Text>

          {items.map((item, index) => (
            <InvoiceItemFormRow
              key={index}
              item={item}
              onChange={(updatedItem) => handleItemChange(index, updatedItem)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}

          <Button title="+ Add Item" onPress={handleAddItem} />

          <Text style={styles.sectionTitle}>Discount</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="decimal-pad"
            value={discount}
            onChangeText={setDiscount}
          />
        </>
      )}

      {activeSection === "payments" && (
        <>
          <Text style={styles.sectionTitle}>Payments</Text>

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

          <Button title="+ Add Payment" onPress={handleAddPayment} />
        </>
      )}

      <Button
        title={updateInvoice.isPending ? "Saving..." : "Save Changes"}
        onPress={handleSubmit}
        disabled={updateInvoice.isPending}
      />

      <Button title="Back" onPress={() => router.back()} />

      <ClientPickerModal
        visible={clientPickerVisible}
        onSelect={handleSelectClient}
        onDismiss={() => setClientPickerVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    flexDirection: "row",
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  tabActive: {
    fontWeight: "bold",
    color: "#3399ff",
  },
  tabInactive: {
    color: "#666",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickClientButton: {
    borderWidth: 1,
    borderColor: "#3399ff",
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
  },
  pickClientButtonText: {
    color: "#3399ff",
    fontWeight: "bold",
  },
  selectedClientCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
  },
  selectedClientName: {
    fontWeight: "bold",
  },
  clearClientText: {
    color: "#999",
  },
});
