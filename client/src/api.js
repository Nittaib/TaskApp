import axios from "axios";

export const API_URL = "http://localhost:3001";

export const fetchTasks = async () => {
  const { data } = await axios.get(`${API_URL}/tasks`);
  return Object.values(data).map((task) => JSON.parse(task));
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/removeTask?id=${id}`);
};
