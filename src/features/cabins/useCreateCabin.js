import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  const quesryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New cabin is successfully created");
      quesryClient.invalidateQueries({ quesryKey: ["cabins"] });
      // reset();
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabin };
}
