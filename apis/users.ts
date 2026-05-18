import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "./core";

interface UserInformation {
  email: string;
  name: string;
  phone: string;
}

const getUser = async () => {
  const { data, message } = await api.get<UserInformation>("api/users/info");

  if (!data) {
    throw new Error(message);
  }

  return data;
};

export const useGetUserAPI = () =>
  useSuspenseQuery({
    queryKey: ["user", "info"],
    queryFn: getUser,
  });
