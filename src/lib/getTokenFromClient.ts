import { authClient } from "./auth-client";

export const getTokenFromserver = async() => {
  // Get JWT token from Better Auth
  const { data: tokenData, error: tokenError } = await authClient.token();

  if (tokenError || !tokenData?.token) {
    throw new Error(tokenError?.message || "JWT token not found!");
  }

  const token = tokenData.token;

  return token;
};