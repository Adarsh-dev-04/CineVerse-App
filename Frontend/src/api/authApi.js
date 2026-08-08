import api from "./client";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "Failed to log in";

    throw new Error(message);
  }
};

export const registerUser = async (name, email, password, avatar) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    avatar,
  });

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me", {});

  return response.data;
};
