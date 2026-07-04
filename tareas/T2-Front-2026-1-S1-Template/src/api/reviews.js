import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchReviewsByArtist = async (
  artistId,
  page = 1,
  limit = 10
) => {
  const { data } = await axios.get(`${API_URL}/reviews/artist/${artistId}`, {
    params: { page, limit },
  });
  return data;
};

export const fetchMyReviews = async (page = 1, limit = 10) => {
  const { data } = await axios.get(`${API_URL}/reviews/my`, {
    params: { page, limit },
    ...getAuthHeaders(),
  });
  return data;
};

export const createReview = async ({ artistId, rating, comment }) => {
  const { data } = await axios.post(
    `${API_URL}/reviews`,
    { artistId, rating, comment },
    getAuthHeaders()
  );
  return data;
};

export const updateReview = async (reviewId, { rating, comment }) => {
  const { data } = await axios.put(
    `${API_URL}/reviews/${reviewId}`,
    { rating, comment },
    getAuthHeaders()
  );
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await axios.delete(
    `${API_URL}/reviews/${reviewId}`,
    getAuthHeaders()
  );
  return data;
};
