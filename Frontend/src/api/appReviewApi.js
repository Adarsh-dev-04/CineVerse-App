import api from "./client";

export const patchReview = async ({rating, review, tags}) => {
  try {
    const response = await api.patch("/app-review/me", {
      rating,
      review,
      tags,
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "Failed to write review";

    throw new Error(message);
  }
};

export const getReview = async () => {
  try {
    const response = await api.get("/app-review/me");

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "Failed to get review";

    throw new Error(message);
  }
};
