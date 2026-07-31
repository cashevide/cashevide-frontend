import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { api } from "@/src/shared/api/client";
import { INVOICE_ENDPOINTS } from "@/src/shared/api/endpoints";

// Web: triggers a normal browser download via a Blob + temporary <a> tag.
function downloadPdfWeb(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

// Native: writes the PDF into the app's cache directory using the new
// expo-file-system object API (File/Paths — stable as of SDK 54+), then
// opens the OS share sheet via expo-sharing so the user can save/share it.
async function downloadAndSharePdfNative(
  arrayBuffer: ArrayBuffer,
  filename: string,
) {
  const file = new File(Paths.cache, filename);

  if (file.exists) {
    file.delete();
  }

  file.create();
  file.write(new Uint8Array(arrayBuffer));

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/pdf",
    dialogTitle: `Share ${filename}`,
    UTI: "com.adobe.pdf",
  });
}

// Extracts the filename from the backend's Content-Disposition header
// (e.g. `attachment; filename="Invoice_INV-0003.pdf"`), falling back to a
// generic name if the header is missing or doesn't match.
function extractFilename(
  contentDisposition: string | undefined,
  fallback: string,
): string {
  if (!contentDisposition) {
    return fallback;
  }

  const match = contentDisposition.match(/filename="?([^"]+)"?/);

  return match?.[1] ?? fallback;
}

// Downloads an invoice PDF and either triggers a browser download (web) or
// opens the native share sheet (iOS/Android).
//
// Important: the `api` client's default Accept header is `application/json`
// (see shared/api/client.ts), but this endpoint's DRF view only has a PDF
// renderer configured — sending the default header causes DRF's content
// negotiation to reject the request with 406 Not Acceptable. We override
// the Accept header to `application/pdf` for this request only.
//
// Also: the backend returns `application/pdf` as the content-type even on
// a 404 (the body is just the text "Not Found" in that case) — so we rely
// on the HTTP status code via axios throwing on non-2xx, not on the
// content-type, to detect failure. Do not add content-type checks here.
export async function downloadInvoicePdfApi(id: number): Promise<void> {
  const response = await api.get(INVOICE_ENDPOINTS.downloadPdf(id), {
    headers: {
      Accept: "application/pdf",
    },
    responseType: Platform.OS === "web" ? "blob" : "arraybuffer",
  });

  const filename = extractFilename(
    response.headers["content-disposition"],
    `Invoice_${id}.pdf`,
  );

  if (Platform.OS === "web") {
    downloadPdfWeb(response.data as Blob, filename);
    return;
  }

  await downloadAndSharePdfNative(response.data as ArrayBuffer, filename);
}
