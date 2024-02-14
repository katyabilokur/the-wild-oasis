import { useQuery } from "@tanstack/react-query";
import { getBookedFutureDatesForCabin } from "../../services/apiBookings";

export function useCabinBlockedDates(id) {
  const {
    isLoading,
    data: dates,
    error,
  } = useQuery({
    queryKey: ["bookings-blocked-dates", id],
    queryFn: () => getBookedFutureDatesForCabin(id),
  });

  return { isLoading, dates, error };
}
