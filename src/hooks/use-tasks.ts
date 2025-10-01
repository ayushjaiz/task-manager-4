import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "done";
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      status?: "pending" | "done";
    }) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      return response.json();
    },
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<TasksResponse>([
        "tasks",
        1,
        "",
        "all",
      ]);

      // Optimistically update to the new value
      if (previousTasks) {
        const optimisticTask: Task = {
          _id: `temp-${Date.now()}`,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status || "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<TasksResponse>(["tasks", 1, "", "all"], {
          ...previousTasks,
          tasks: [optimisticTask, ...previousTasks.tasks],
          pagination: {
            ...previousTasks.pagination,
            total: previousTasks.pagination.total + 1,
          },
        });
      }

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", 1, "", "all"],
          context.previousTasks
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous values for all task queries
      const queryKeys = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"] });
      const previousData = queryKeys.map((query) => ({
        queryKey: query.queryKey,
        data: query.state.data,
      }));

      // Optimistically update all task queries
      queryKeys.forEach(({ queryKey }) => {
        const currentData = queryClient.getQueryData<TasksResponse>(queryKey);
        if (currentData) {
          const updatedTasks = currentData.tasks.map((task) =>
            task._id === id
              ? { ...task, ...data, updatedAt: new Date().toISOString() }
              : task
          );
          queryClient.setQueryData(queryKey, {
            ...currentData,
            tasks: updatedTasks,
          });
        }
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback all optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete task");
      }

      return response.json();
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous values for all task queries
      const queryKeys = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"] });
      const previousData = queryKeys.map((query) => ({
        queryKey: query.queryKey,
        data: query.state.data,
      }));

      // Optimistically update all task queries
      queryKeys.forEach(({ queryKey }) => {
        const currentData = queryClient.getQueryData<TasksResponse>(queryKey);
        if (currentData) {
          const updatedTasks = currentData.tasks.filter(
            (task) => task._id !== id
          );
          queryClient.setQueryData(queryKey, {
            ...currentData,
            tasks: updatedTasks,
            pagination: {
              ...currentData.pagination,
              total: Math.max(0, currentData.pagination.total - 1),
            },
          });
        }
      });

      return { previousData };
    },
    onError: (err, id, context) => {
      // Rollback all optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
