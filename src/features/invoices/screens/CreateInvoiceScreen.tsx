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
import { router } from "expo-router";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { ROUTES } from "@/src/shared/navigation/routes";
import { CurrencyPicker } from "@/src/shared/ui";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import ClientPickerModal from "../components/ClientPickerModal";
import InvoiceItemFormRow from "../components/InvoiceItemFormRow";

import type { Client } from "@/src/features/clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type {
  CreateInvoiceError,
  CreateInvoiceRequest,
} from "../types/invoiceTypes";

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

export default function CreateInvoiceScreen() {
  const businessProfile = useBusinessProfile();
  const createInvoice = useCreateInvoice();

  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<InvoiceItemRequest[]>([createEmptyItem()]);

  const [currencyInitialized, setCurrencyInitialized] = useState(false);

  useEffect(() => {
    if (businessProfile.data?.currency && !currencyInitialized) {
      setCurrency(businessProfile.data.currency);
      setCurrencyInitialized(true);
    }
  }, [businessProfile.data, currencyInitialized]);

  if (businessProfile.isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (
    !businessProfile.data ||
    !isBusinessProfileComplete(businessProfile.data)
  ) {
    return (
      <View style={styles.centered}>
        <Text style={styles.gateTitle}>Complete Your Business Profile</Text>
        <Text style={styles.gateText}>
          Add your business name, logo, and address before creating an invoice —
          this information appears on every invoice you send.
        </Text>
        <Button
          title="Complete Business Profile"
          onPress={() => router.push("/profile/business-edit")}
        />
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InvoiceSubTabs />

      <Text style={styles.sectionTitle}>Client</Text>

      {selectedClient ? (
        <View style={styles.selectedClientCard}>
          <View style={styles.selectedClientInfo}>
            <Text style={styles.selectedClientName}>{selectedClient.name}</Text>
            <Text style={styles.selectedClientMeta}>
              {selectedClient.phone}
            </Text>
          </View>
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

      <Text style={styles.sectionTitle}>Currency</Text>
      <CurrencyPicker value={currency} onChange={setCurrency} />

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

      <Button
        title={createInvoice.isPending ? "Creating..." : "Create Invoice"}
        onPress={handleSubmit}
        disabled={createInvoice.isPending}
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
    padding: 24,
    gap: 12,
  },
  gateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  gateText: {
    textAlign: "center",
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
  selectedClientInfo: {
    flex: 1,
  },
  selectedClientName: {
    fontWeight: "bold",
  },
  selectedClientMeta: {
    color: "#666",
    fontSize: 13,
  },
  clearClientText: {
    color: "#999",
  },
});
