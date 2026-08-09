import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Markdown from "react-native-markdown-display";

import { Text, Button, Spinner, Modal } from "@/src/shared/ui";
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

// react-native-markdown-display's `style` prop needs plain RGB/hex values —
// it cannot resolve NativeWind's CSS custom properties (rgb(var(--x))),
// same limitation as Reanimated worklets. Hardcoded to the dark theme's
// foreground/muted-foreground tokens; revisit if/when light mode support
// is needed here.
const markdownStyle = {
  body: { color: "#f2f2f0", fontSize: 14, lineHeight: 20 },
  heading1: { color: "#f2f2f0" },
  heading2: { color: "#f2f2f0" },
  strong: { color: "#f2f2f0" },
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
    <View className="border-t border-border">
      <Pressable
        onPress={onToggle}
        className="flex-row justify-between items-center py-3"
      >
        <Text variant="body-sm">{title}</Text>
        <Text variant="body-sm">{isExpanded ? "−" : "+"}</Text>
      </Pressable>

      {isExpanded ? (
        <View className="pb-3">
          {legalDocumentQuery.isLoading ? (
            <Spinner size="sm" />
          ) : legalDocumentQuery.isError ? (
            <Text variant="body-sm" className="text-destructive-text">
              Could not load this document.
            </Text>
          ) : (
            <Markdown style={markdownStyle}>
              {legalDocumentQuery.data?.content ?? ""}
            </Markdown>
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
        <View className="gap-2">
          {acceptMutation.isError ? (
            <Text variant="body-sm" className="text-destructive-text">
              Could not accept the documents. Please try again.
            </Text>
          ) : null}

          {acceptMutation.isPending ? (
            <View className="items-center">
              <Spinner size="sm" />
            </View>
          ) : (
            <Button
              variant="primary"
              size="sm"
              title="Accept & Continue"
              onPress={handleAccept}
            />
          )}
        </View>
      }
    >
      <ScrollView className="max-h-[400px]">
        <Text variant="heading">Updated Terms &amp; Privacy Policy</Text>

        <Text variant="body" className="mt-2 mb-2">
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
