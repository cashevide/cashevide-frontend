import { api } from "@/src/shared/api/client";
import { INVOICE_ENDPOINTS } from "@/src/shared/api/endpoints";
import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

export async function getInvoiceDashboardApi(): Promise<InvoiceDashboardResponse> {
  const response = await api.get<InvoiceDashboardResponse>(
    INVOICE_ENDPOINTS.dashboardAnalytics,
  );
  return response.data;
}
