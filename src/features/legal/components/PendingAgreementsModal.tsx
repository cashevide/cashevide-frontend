import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Markdown from "react-native-markdown-display";

import { Modal } from "@/src/shared/ui";
import { useAcceptLegalDocuments } from "../hooks/useAcceptLegalDocuments";
import { useLegalDocument } from "../hooks/useLegalDocument";

import type { PendingLegalDoc } from "@/src/features/profile/types/userProfileTypes";
import type { LegalDocumentType } from "../types/legalTypes";

type PendingAgreementsModalProps = {
  visible: boolean;
  pendingLegalDocs: PendingLegalDoc[];
};

type ExpandableSectionProps = {
  title: string;
  docType: LegalDocumentType;
  isExpanded: boolean;
  onToggle: () => void;
};

function ExpandableSection({
  title,
  docType,
  isExpanded,
  onToggle,
}: ExpandableSectionProps) {
  const legalDocumentQuery = useLegalDocument(
    isExpanded ? docType.toLowerCase() : "",
  );

  return (
    <View style={styles.section}>
      <Pressable onPress={onToggle} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text>{isExpanded ? "−" : "+"}</Text>
      </Pressable>

      {isExpanded ? (
        <View style={styles.sectionContent}>
          {legalDocumentQuery.isLoading ? (
            <ActivityIndicator />
          ) : legalDocumentQuery.isError ? (
            <Text style={styles.error}>Could not load this document.</Text>
          ) : (
            <Markdown>{legalDocumentQuery.data?.content ?? ""}</Markdown>
          )}
        </View>
      ) : null}
    </View>
  );
}

export function PendingAgreementsModal({
  visible,
  pendingLegalDocs,
}: PendingAgreementsModalProps) {
  const [expandedDocType, setExpandedDocType] =
    useState<LegalDocumentType | null>(null);

  const acceptMutation = useAcceptLegalDocuments();

  function toggleSection(docType: LegalDocumentType) {
    setExpandedDocType((current) => (current === docType ? null : docType));
  }

  function handleAccept() {
    const legalDocIds = pendingLegalDocs.map((doc) => doc.id);

    acceptMutation.mutate({ legal_doc_ids: legalDocIds });
  }

  return (
    <Modal
      visible={visible}
      dismissible={false}
      footer={
        <>
          {acceptMutation.isError ? (
            <Text style={styles.error}>
              Could not accept the documents. Please try again.
            </Text>
          ) : null}

          {acceptMutation.isPending ? (
            <ActivityIndicator />
          ) : (
            <Button title="Accept & Continue" onPress={handleAccept} />
          )}
        </>
      }
    >
      <ScrollView>
        <Text style={styles.title}>Updated Terms & Privacy Policy</Text>

        <Text style={styles.description}>
          We have updated our legal documents. Please review and accept to
          continue using Cashevide.
        </Text>

        <ExpandableSection
          title="Terms and Conditions"
          docType="TERMS"
          isExpanded={expandedDocType === "TERMS"}
          onToggle={() => toggleSection("TERMS")}
        />

        <ExpandableSection
          title="Privacy Policy"
          docType="PRIVACY"
          isExpanded={expandedDocType === "PRIVACY"}
          onToggle={() => toggleSection("PRIVACY")}
        />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sectionTitle: {
    fontWeight: "500",
  },
  sectionContent: {
    paddingBottom: 12,
  },
  error: {
    color: "red",
  },
});
