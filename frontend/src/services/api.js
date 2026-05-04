const BASE_URL = "http://127.0.0.1:8000";

export const getServers = async () => {
  const res = await fetch(`${BASE_URL}/servers`);
  return res.json();
};

export const addServerApi = async (data) => {
  await fetch(`${BASE_URL}/add-server`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteServerApi = async (id) => {
  await fetch(`${BASE_URL}/delete-server/${id}`, {
    method: "DELETE",
  });
};

export const updateServerApi = async (id, data) => {
  await fetch(`${BASE_URL}/update-server/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};