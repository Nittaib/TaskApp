import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { API_URL } from "../api";

const TaskForm = () => {
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newTask) => axios.post(`${API_URL}/addTask`, newTask),
    {
      onMutate: async (newTask) => {
        await queryClient.cancelQueries("tasks");

        const previousTasks = queryClient.getQueryData("tasks");

        queryClient.setQueryData("tasks", (old) => [
          ...old,
          { id: Date.now(), ...newTask },
        ]);

        return { previousTasks };
      },
      onError: (err, newTask, context) => {
        queryClient.setQueryData("tasks", context.previousTasks);
      },
      onSettled: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      mutation.mutate({ description });
      setDescription("");
    }
  };

  const onDescriptionChange = (e) => setDescription(e.target.value);

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={description}
        onChange={onDescriptionChange}
        placeholder="Enter task description"
        required
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
