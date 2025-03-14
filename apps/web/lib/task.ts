import { AxiosError } from "axios";
import { BACKEND_URL } from "./constants";
import { getSession } from "./session";
import { CreateTaskInput, Task, UpdateTaskInput } from "./schema";
import { authFetch } from "./auth-fetch";

const baseUrl = BACKEND_URL + "/tasks/";

export const getTasks = async () => {
  try {
    const session = await getSession();
    if (!session) return null;

    const res = await authFetch<Task[]>(
      baseUrl + "?" + new URLSearchParams({ userId: session.user.id }),
      {
        method: "GET",
      }
    );
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const createTask = async (input: CreateTaskInput) => {
  try {
    const session = await getSession();
    if (!session) return null;

    const res = await authFetch(baseUrl, {
      method: "POST",
      data: input,
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  try {
    const session = await getSession();
    if (!session) return null;

    const res = await authFetch(baseUrl + id, {
      method: "PUT",
      data: input,
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const getTask = async (id: string) => {
  try {
    const session = await getSession();
    if (!session) return null;

    const res = await authFetch<Task>(baseUrl + id, {
      method: "GET",
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const deleteTask = async (id: string) => {
  try {
    const session = await getSession();
    if (!session) return null;

    const res = await authFetch(baseUrl + id, {
      method: "DELETE",
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};
