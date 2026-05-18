import { api } from "./core";

interface NiceEncryptedData {
  token_version_id: string;
  enc_data: string;
  integrity_value: string;
}

export const getNiceEncryptedData = async (purpose: 'SIGNUP' | 'PASSWORD_RESET') => {
  const clientRedirectUri = window.location.origin; // localhost:3000

  const { data, message } = await api.get<NiceEncryptedData>(
    `api/nice/encrypted-data?purpose=${purpose}&clientRedirectUri=${encodeURIComponent(clientRedirectUri)}`
  );

  if (!data) {
    throw new Error(message);
  }

  return data;
};