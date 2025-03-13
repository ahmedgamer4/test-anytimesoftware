import { z } from "zod";
import { BACKEND_URL } from "./constrants";
import axios, { AxiosError } from "axios";
import { createSession } from "./session";

const baseUrl = BACKEND_URL + "/auth/";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  linkedInUrl: z.string().url(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const registerUser = async (input: RegisterInput) => {
  try {
    const res = await axios.post(baseUrl + "register", input);
    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const loginUser = async (input: LoginInput) => {
  try {
    const res = await axios.post(baseUrl + "login", input);

    if (res.status === 200)
      await createSession({
        user: {
          id: res.data.id,
          name: res.data.name,
        },
        accessToken: res.data.accessToken
      });

    return res;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
  }
};
