import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { AxiosError } from "axios";

import { useLegalDocument } from "../hooks/useLegalDocument";
import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type { LegalDocumentNotFoundError } from "../types/legalTypes";

export default function LegalDocumentScreen() {
  const { docType } = useLocalSearchParams<{ docType: string }>();

  const legalDocumentQuery = useLegalDocument(docType ?? "");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const notFoundError =
    legalDocumentQuery.error as AxiosError<LegalDocumentNotFoundError> | null;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();

      return;
    }

    router.replace(isAuthenticated ? ROUTES.reviews.home : ROUTES.welcome);
  }

  if (legalDocumentQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (legalDocumentQuery.isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          {notFoundError?.response?.data?.detail ??
            "This document could not be found."}
        </Text>

        <Button title="Back" onPress={handleBack} />
      </View>
    );
  }

  const document = legalDocumentQuery.data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {document?.document_type === "TERMS"
          ? "Terms and Conditions"
          : "Privacy Policy"}
      </Text>

      <Text style={styles.meta}>
        Version {document?.version} — Effective {document?.effective_date}
      </Text>

      <Markdown>{document?.content ?? ""}</Markdown>

      <Button title="Back" onPress={handleBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  meta: {
    color: "#666",
  },
  error: {
    color: "red",
  },
});
