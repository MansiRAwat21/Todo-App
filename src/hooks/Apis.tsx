import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupApi, createTodoApi, deleteTodos, updateTodos } from "../services/auth.api";
import { toast } from "react-toastify";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupApi,
  });
};

// create todos
export const useCreateTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodoApi,

    onSuccess: (_data, variables) => {
      // todos list ko refresh karo
      queryClient.invalidateQueries({
        queryKey: ["todos", variables.owner_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["todosSummery", variables?.owner_id],
      });
    },
  });
};
// updates todos
export const useUpdatesTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodos,

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["todos", variables?.payload?.owner_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["todosSummery", variables?.payload?.owner_id],
      });
      if (variables?.action === "status") {
        toast.success(
          variables.payload.status === "completed"
            ? "Todo marked as completed ✅"
            : "Todo moved to active 🔄"
        );
      }
    },
    onError: () => {
      toast.error("Failed to update todo ❌");
    },
  });
};

export const useDeleteTodos = (owner_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodos,

    onSuccess: (_data) => {
      // todos list ko refresh karo
      queryClient.invalidateQueries({
        queryKey: ["todos", owner_id],
      });
       queryClient.invalidateQueries({
        queryKey: ["todosSummery",owner_id],
      });
      toast.success('Todo Deleted Successfully')
    },
  });
};