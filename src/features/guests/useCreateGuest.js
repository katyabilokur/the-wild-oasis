import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createGuest as createGuestApi } from "../../services/apiGuests";

export function useCreateGuest() {
  const quesryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createGuestApi,
    onSuccess: () => {
      toast.success("New guest is successfully added");
      quesryClient.invalidateQueries({ quesryKey: ["guests"] });
      // reset();
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createGuest };
}
