import api from "./client";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response;
};

export const registerUser = async (name, email, password, avatar="") => {
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

export const verifyOTP = async (email, otp) => {
  const response = await api.post("/auth/verify-otp",{
    email,
    otp,
  });

  return response.data;
};

export const resendOTP = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};