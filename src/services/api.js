const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const submitComplaint = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/complaint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
};