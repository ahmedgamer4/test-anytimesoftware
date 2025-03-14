import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "./session";

export async function authFetch<T>(
  url: string | URL,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const session = await getSession();

  const authHeaders = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};

  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...options?.headers,
      ...authHeaders,
    },
    url: url.toString(),
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
