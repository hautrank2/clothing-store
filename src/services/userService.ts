import axiosClient from "~/lib/axios";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const userService = {
  signupByEmail(email: string) {
    return axiosClient.post(`${API_ENDPOINT}/user/createWithEmail`, {
      email,
    });
  },

  findByFilter(filter: any) {
    return axiosClient.get(
      `${API_ENDPOINT}/user/filter?${new URLSearchParams(filter).toString()}`
    );
  },
};
