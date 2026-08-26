import { useMemo } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Markdown from "react-native-markdown-display";
import { AxiosError } from "axios";

import { useLegalDocument } from "../hooks/useLegalDocument";
import { useAuthStore } from "@/src/store/authStore";
import { useThemeStore } from "@/src/store/themeStore";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner } from "@/src/shared/ui";

import type { LegalDocumentNotFoundError } from "../types/legalTypes";

// react-native-markdown-display's `style` prop only accepts a plain
// StyleSheet-shaped object (raw values, not NativeWind classNames) — the
// library renders each Markdown rule as its own native Text/View and
// looks up colors from this object directly, so there's no way to hand
// it a `className` string here. This is the one legitimate exception to
// "no StyleSheet in NativeWind files"; every other file in this screen
// still uses className throughout.
//
// Colors are read from the theme store (not NativeWind's colorScheme)
// because this library doesn't re-render on CSS variable changes — it
// needs the actual rgb() string up front, so the style object is
// rebuilt whenever the theme toggles.
function useMarkdownStyle() {
  const theme = useThemeStore((state) => state.theme);

  return useMemo(() => {
    const isDark = theme === "dark";

    const foreground = isDark ? "rgb(242 242 240)" : "rgb(13 13 13)";
    const mutedForeground = isDark ? "rgb(163 163 160)" : "rgb(100 100 96)";
    const link = isDark ? "rgb(91 157 255)" : "rgb(55 122 255)";
    const border = isDark ? "rgb(35 35 35)" : "rgb(225 225 221)";
    const popover = isDark ? "rgb(26 26 26)" : "rgb(246 246 244)";

    return {
      body: {
        color: foreground,
        fontSize: 15,
        lineHeight: 24,
      },
      heading1: {
        color: foreground,
        fontSize: 24,
        fontWeight: "700" as const,
        marginTop: 24,
        marginBottom: 12,
      },
      heading2: {
        color: foreground,
        fontSize: 20,
        fontWeight: "600" as const,
        marginTop: 20,
        marginBottom: 10,
      },
      heading3: {
        color: foreground,
        fontSize: 17,
        fontWeight: "600" as const,
        marginTop: 16,
        marginBottom: 8,
      },
      heading4: {
        color: foreground,
        fontSize: 15,
        fontWeight: "600" as const,
        marginTop: 12,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 12,
      },
      strong: {
        fontWeight: "700" as const,
        color: foreground,
      },
      em: {
        fontStyle: "italic" as const,
      },
      link: {
        color: link,
        textDecorationLine: "underline" as const,
      },
      bullet_list: {
        marginBottom: 12,
      },
      ordered_list: {
        marginBottom: 12,
      },
      list_item: {
        marginBottom: 6,
        flexDirection: "row" as const,
      },
      bullet_list_icon: {
        color: mutedForeground,
        marginRight: 8,
      },
      ordered_list_icon: {
        color: mutedForeground,
        marginRight: 8,
      },
      hr: {
        backgroundColor: border,
        height: 1,
        marginVertical: 20,
      },
      blockquote: {
        backgroundColor: popover,
        borderLeftColor: border,
        borderLeftWidth: 3,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
      },
      code_inline: {
        backgroundColor: popover,
        color: foreground,
        borderRadius: 4,
        paddingHorizontal: 4,
        fontFamily: "monospace",
      },
      code_block: {
        backgroundColor: popover,
        color: foreground,
        borderRadius: 8,
        padding: 12,
        fontFamily: "monospace",
      },
      fence: {
        backgroundColor: popover,
        color: foreground,
        borderRadius: 8,
        padding: 12,
        fontFamily: "monospace",
      },
      table: {
        borderColor: border,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 12,
      },
      th: {
        color: foreground,
        fontWeight: "600" as const,
        padding: 8,
      },
      td: {
        color: foreground,
        padding: 8,
      },
      tr: {
        borderBottomColor: border,
        borderBottomWidth: 1,
      },
    };
  }, [theme]);
}

export default function LegalDocumentScreen() {
  const { docType } = useLocalSearchParams<{ docType: string }>();

  const legalDocumentQuery = useLegalDocument(docType ?? "");
  const markdownStyle = useMarkdownStyle();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const notFoundError =
    legalDocumentQuery.error as AxiosError<LegalDocumentNotFoundError> | null;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(isAuthenticated ? ROUTES.home : ROUTES.welcome);
  }

  if (legalDocumentQuery.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          showBackButton
          containerVariant="narrow"
          onBackPress={handleBack}
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  if (legalDocumentQuery.isError) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          showBackButton
          containerVariant="narrow"
          onBackPress={handleBack}
        />
        <Container variant="narrow" safeArea="bottom">
          <View className="flex-1 items-center justify-center px-6 gap-6">
            <Text variant="body" className="text-destructive text-center">
              {notFoundError?.response?.data?.detail ??
                "This document could not be found."}
            </Text>
            <Button variant="outline" title="Back" onPress={handleBack} />
          </View>
        </Container>
      </View>
    );
  }

  const document = legalDocumentQuery.data;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        showBackButton
        containerVariant="narrow"
        onBackPress={handleBack}
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-1">
          <Text variant="heading">
            {document?.document_type === "TERMS"
              ? "Terms and Conditions"
              : "Privacy Policy"}
          </Text>

          <Text variant="body-sm" className="text-muted-foreground mb-4">
            Version {document?.version} — Effective {document?.effective_date}
          </Text>

          <Markdown style={markdownStyle}>{document?.content ?? ""}</Markdown>
        </View>
      </Container>
    </View>
  );
}
