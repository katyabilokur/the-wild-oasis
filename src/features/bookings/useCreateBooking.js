import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createBooking as createBookingApi } from "../../services/apiBookings";

export function useCreateBooking() {
  const quesryClient = useQueryClient();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      quesryClient.invalidateQueries({ quesryKey: ["bookings"] });
      // reset();
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBooking };
}
