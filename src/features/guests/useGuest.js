import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../../services/apiGuests";

export function useGuest(searchParam) {
  const {
    refetch: searchGuest,
    isLoading,
    data: guest,
    error,
  } = useQuery({
    queryKey: ["guest", searchParam],
    queryFn: () => getGuest(searchParam),
  });

  return { isLoading, guest, error, searchGuest };
}
