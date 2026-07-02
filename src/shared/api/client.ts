import axios from "axios";

import { env } from "@/src/config/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});
