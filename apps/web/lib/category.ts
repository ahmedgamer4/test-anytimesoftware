import { AxiosError } from "axios";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";
import { Category } from "./schema";

const baseUrl = BACKEND_URL + "/categories/";

export const createCategory = async (name: string) => {
  try {
    const res = await authFetch(baseUrl, { method: "POST", data: { name } });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const getCategories = async () => {
  try {
    const res = await authFetch<Category[]>(baseUrl, { method: "GET" });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};
