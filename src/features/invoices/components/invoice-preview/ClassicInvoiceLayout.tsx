import { useState } from "react";
import {
  Image,
  Text as RNText,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import InvoicePreviewStatusBadge from "./InvoicePreviewStatusBadge";

import type { InvoicePreviewData } from "../InvoicePreview";

type ClassicInvoiceLayoutProps = {
  invoice: InvoicePreviewData;
};

// This layout is a 1:1 pixel port of the backend's actual PDF template
// (invoice.html — @page A4, mm/pt units), not an independent design.
// Every dimension below is that template's mm/pt value converted to px
// at 96 DPI (1pt = 96/72px, 1mm = 96/25.4px) — the same math a
// browser's print engine uses for `size: A4`, and the same reference
// point the backend's PDF renderer uses. Colors are the template's
// exact hex values. Fonts are System for now (Geist/Poppins/Orange
// Avenue DEMO are a later pass, once those font files are bundled into
// the app) — sizes and weights are matched even though the typeface
// isn't yet.
const PX = {
  pageWidth: 794, // 210mm
  pageHeight: 1123, // 297mm
  marginX: 68, // 18mm
  marginTop: 76, // 20mm
  marginBottom: 76, // 20mm
  headerMarginBottom: 44, // 11.5mm
  logoMaxWidth: 213, // 160pt
  logoMaxHeight: 73, // 55pt
  titleSize: 97, // 73pt
  bodySize: 16, // 12pt (base)
  smallSize: 15, // 11pt
  nameSize: 19, // 14pt
  boldSize: 17, // 13pt
  companyMetaMarginBottom: 27, // 20pt
  companyNameMaxWidth: 427, // 320pt
  addressMaxWidth: 293, // 220pt
  clientAddressMaxWidth: 320, // 240pt
  billToPaddingV: 21, // 16pt
  billToPaddingH: 24, // 18pt
  billToMarginBottom: 27, // 20pt
  itemTableMarginBottom: 27, // 20pt
  barHeight: 32, // 24pt (table header row height, total-amount bar, footer bar)
  cellPaddingXHeader: 16, // 12pt
  cellPaddingYBody: 12, // 9pt
  totalsRowWidth: 293, // 220pt
  totalsGap: 8, // 6pt
  totalsMarginBottom: 27, // 20pt
} as const;

const COLORS = {
  cardBg: "#f2f2f2",
  heading: "#000000",
  text: "#2d2d2d",
  white: "#ffffff",
} as const;

// Always light/fixed — this is a pixel-locked replica of a print
// document, not a themed UI screen, so it never reads from the app's
// dark/light color tokens.
export default function ClassicInvoiceLayout({
  invoice,
}: ClassicInvoiceLayoutProps) {
  const liveBusinessProfile = useBusinessProfile();
  const [scale, setScale] = useState(1);

  // The canvas below is always rendered at its true fixed size
  // (794x1123px) — never resized to fit its container — and this
  // wrapper instead scales that whole canvas down/up uniformly with a
  // transform, the same way a PDF viewer zooms a fixed page rather
  // than reflowing its text. onLayout gives the space actually
  // available (phone-width on mobile, whatever column width on
  // desktop); dividing that by the canvas's true width gives the
  // scale factor. The wrapper's own height is set to the *scaled*
  // canvas height so it doesn't reserve the canvas's full unscaled
  // height in the surrounding layout.
  function handleLayout(event: LayoutChangeEvent) {
    const availableWidth = event.nativeEvent.layout.width;
    if (availableWidth > 0) {
      setScale(availableWidth / PX.pageWidth);
    }
  }

  // A saved invoice (has an id) carries a frozen business_snapshot
  // from creation time — that snapshot is the ONLY source used for it,
  // even if it's somehow empty, so this preview always matches what
  // download_pdf on the backend would actually render. Only an
  // unsaved draft (no id yet) falls back to the live profile, since
  // that's genuinely the data the backend will snapshot on first save.
  const isSavedInvoice = invoice.id != null;
  const snapshot = invoice.business_snapshot;

  const businessName = isSavedInvoice
    ? snapshot?.business_name
    : liveBusinessProfile.data?.business_name;
  const businessLogo = isSavedInvoice
    ? snapshot?.logo
    : liveBusinessProfile.data?.logo;
  const businessAddress = isSavedInvoice
    ? snapshot?.address
    : liveBusinessProfile.data?.address;
  const businessEmail = isSavedInvoice
    ? snapshot?.business_email
    : liveBusinessProfile.data?.business_email;
  const businessPhone = isSavedInvoice
    ? snapshot?.phone_number
    : liveBusinessProfile.data?.phone_number;
  const businessWebsite = isSavedInvoice
    ? snapshot?.website
    : liveBusinessProfile.data?.website;

  const hasLogo = !!businessLogo;
  const hasBusinessAddress = !!businessAddress;
  const hasBusinessEmail = !!businessEmail;
  const hasBusinessPhone = !!businessPhone;
  const hasClientAddress = !!invoice.address;
  const hasClientPhone = !!invoice.phone;
  const hasDiscount = Number(invoice.discount) > 0;
  const hasAmountPaid =
    invoice.amount_paid != null && Number(invoice.amount_paid) > 0;

  return (
    <View style={{ height: PX.pageHeight * scale }} onLayout={handleLayout}>
      <View
        style={{
          width: PX.pageWidth,
          minHeight: PX.pageHeight,
          backgroundColor: COLORS.white,
          transform: [{ scale }],
          transformOrigin: "top left",
        }}
      >
        <View
          style={{
            paddingHorizontal: PX.marginX,
            paddingTop: PX.marginTop,
            paddingBottom: PX.marginBottom + PX.barHeight,
          }}
        >
          {/* -------------------- Header: logo + big "Invoice" title -------------------- */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: PX.headerMarginBottom,
            }}
          >
            {hasLogo ? (
              <Image
                source={{ uri: businessLogo ?? undefined }}
                style={{
                  maxWidth: PX.logoMaxWidth,
                  maxHeight: PX.logoMaxHeight,
                  width: PX.logoMaxWidth,
                  height: PX.logoMaxHeight,
                }}
                resizeMode="contain"
              />
            ) : (
              <View />
            )}
            <RNText
              style={{
                fontSize: PX.titleSize,
                fontWeight: "400",
                color: COLORS.heading,
                lineHeight: PX.titleSize,
              }}
            >
              Invoice
            </RNText>
          </View>

          {/* -------------------- Company meta: business info + invoice meta -------------------- */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: PX.companyMetaMarginBottom,
            }}
          >
            <View style={{ maxWidth: PX.companyNameMaxWidth }}>
              <RNText
                style={{
                  fontSize: PX.nameSize,
                  fontWeight: "700",
                  color: COLORS.heading,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {businessName || "Your Business"}
              </RNText>
              {hasBusinessAddress && (
                <RNText
                  style={{
                    fontSize: PX.bodySize,
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                    marginBottom: 8,
                  }}
                >
                  {businessAddress}
                </RNText>
              )}
              {hasBusinessEmail && (
                <RNText
                  style={{
                    fontSize: PX.bodySize,
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                    marginBottom: 5,
                  }}
                >
                  {businessEmail}
                </RNText>
              )}
              {hasBusinessPhone && (
                <RNText
                  style={{
                    fontSize: PX.boldSize,
                    fontWeight: "700",
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                  }}
                >
                  {businessPhone}
                </RNText>
              )}
            </View>

            <View style={{ alignItems: "flex-end", gap: 5 }}>
              <RNText
                style={{
                  fontSize: PX.nameSize,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                {invoice.invoice_number ?? "—"}
              </RNText>
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Issue Date: {invoice.issue_date ?? "—"}
              </RNText>
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Due Date: {invoice.due_date ?? "—"}
              </RNText>
            </View>
          </View>

          {/* -------------------- Bill To card -------------------- */}
          <View
            style={{
              backgroundColor: COLORS.cardBg,
              paddingVertical: PX.billToPaddingV,
              paddingHorizontal: PX.billToPaddingH,
              marginBottom: PX.billToMarginBottom,
            }}
          >
            <RNText
              style={{
                fontSize: PX.bodySize,
                fontWeight: "700",
                color: COLORS.heading,
                marginBottom: 8,
              }}
            >
              BILL TO:
            </RNText>
            <RNText
              style={{
                fontSize: PX.bodySize,
                fontWeight: "600",
                color: COLORS.heading,
                marginBottom: 5,
              }}
            >
              {invoice.name || "Untitled Client"}
            </RNText>
            {hasClientAddress && (
              <RNText
                style={{
                  fontSize: PX.bodySize,
                  color: COLORS.text,
                  maxWidth: PX.clientAddressMaxWidth,
                  marginBottom: 8,
                }}
              >
                {invoice.address}
              </RNText>
            )}
            {hasClientPhone && (
              <RNText
                style={{
                  fontSize: PX.boldSize,
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                {invoice.phone}
              </RNText>
            )}
          </View>

          {/* -------------------- Item table -------------------- */}
          <View style={{ marginBottom: PX.itemTableMarginBottom }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: COLORS.heading,
                height: PX.barHeight,
                alignItems: "center",
              }}
            >
              <RNText
                style={{
                  flex: 2,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: "700",
                  paddingHorizontal: PX.cellPaddingXHeader,
                }}
              >
                ITEM
              </RNText>
              <RNText
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: "700",
                  paddingHorizontal: PX.cellPaddingXHeader,
                }}
              >
                QTY
              </RNText>
              <RNText
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: "700",
                  paddingHorizontal: PX.cellPaddingXHeader,
                }}
              >
                PRICE
              </RNText>
              <RNText
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: "700",
                  paddingHorizontal: PX.cellPaddingXHeader,
                  textAlign: "right",
                }}
              >
                TOTAL
              </RNText>
            </View>

            {invoice.items.map((item, index) => {
              const isEvenRow = index % 2 === 1; // template: nth-child(even)

              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: isEvenRow ? COLORS.cardBg : COLORS.white,
                    paddingVertical: PX.cellPaddingYBody,
                  }}
                >
                  <RNText
                    style={{
                      flex: 2,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingHorizontal: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.title || "—"}
                  </RNText>
                  <RNText
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingHorizontal: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.quantity || "—"}
                  </RNText>
                  <RNText
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingHorizontal: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.unit_price || "—"}
                  </RNText>
                  <RNText
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingHorizontal: PX.cellPaddingXHeader,
                      textAlign: "right",
                    }}
                  >
                    {item.total || "—"}
                  </RNText>
                </View>
              );
            })}
          </View>

          {/* -------------------- Totals -------------------- */}
          <View
            style={{
              alignItems: "flex-end",
              gap: PX.totalsGap,
              marginBottom: PX.totalsMarginBottom,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingHorizontal: PX.cellPaddingXHeader,
              }}
            >
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Subtotal
              </RNText>
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {invoice.subtotal}
              </RNText>
            </View>

            {hasDiscount && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingHorizontal: PX.cellPaddingXHeader,
                }}
              >
                <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Discount
                </RNText>
                <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {invoice.discount}
                </RNText>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingHorizontal: PX.cellPaddingXHeader,
              }}
            >
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Total amount
              </RNText>
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {invoice.total_amount}
              </RNText>
            </View>

            {hasAmountPaid && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingHorizontal: PX.cellPaddingXHeader,
                }}
              >
                <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Amount Paid
                </RNText>
                <RNText style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {invoice.amount_paid}
                </RNText>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: PX.totalsRowWidth,
                backgroundColor: COLORS.heading,
                height: PX.barHeight,
                paddingHorizontal: PX.cellPaddingXHeader,
                marginTop: 5,
              }}
            >
              <RNText style={{ fontSize: PX.bodySize, color: COLORS.white }}>
                Balance Due
              </RNText>
              <RNText
                style={{
                  fontSize: PX.bodySize,
                  fontWeight: "700",
                  color: COLORS.white,
                }}
              >
                {invoice.currency} {invoice.balance_due ?? invoice.total_amount}
              </RNText>
            </View>
          </View>

          {invoice.status && (
            <View style={{ position: "absolute", top: 0, right: 0 }}>
              <InvoicePreviewStatusBadge status={invoice.status} />
            </View>
          )}
        </View>

        {/* -------------------- Footer bar -------------------- */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: PX.barHeight,
            backgroundColor: COLORS.heading,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!!businessWebsite && (
            <RNText style={{ color: COLORS.white, fontSize: PX.smallSize }}>
              {businessWebsite}
            </RNText>
          )}
        </View>
      </View>
    </View>
  );
}
