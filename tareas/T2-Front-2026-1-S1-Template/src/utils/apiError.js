export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  if (Array.isArray(data?.details) && data.details.length) {
    return data.details.join(" ");
  }
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  return "Algo salió mal. Intenta de nuevo.";
}
