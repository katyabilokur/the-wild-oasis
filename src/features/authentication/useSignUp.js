import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { toast } from "react-hot-toast";

export function useSignUp() {
  const {
    mutate: signup,
    isLoading,
    reset,
  } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success("Account successfully created. Please verify email");
    },
    onSettled: () => reset,
  });

  return { signup, isLoading };
}
