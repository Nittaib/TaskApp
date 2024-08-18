import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchTasks, deleteTask } from "../api";

const TaskList = () => {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery("tasks", fetchTasks, {
    refetchInterval: false,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    cacheTime: 300000,
  });

  const mutation = useMutation(deleteTask, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("tasks");

      const previousTasks = queryClient.getQueryData("tasks");

      queryClient.setQueryData("tasks", (old) =>
        old.filter((task) => task.id !== id)
      );

      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData("tasks", context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading tasks</p>;

  const onDeleteClicked = (id) => mutation.mutate(id);

  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <div>There aren't any tasks yet, click add to create one.</div>
      ) : (
        tasks.map((task) => (
          <li key={task.id}>
            {task.description}
            <button onClick={() => onDeleteClicked(task.id)}>Delete</button>
          </li>
        ))
      )}
    </ul>
  );
};

export default TaskList;
