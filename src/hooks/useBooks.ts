import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getOwners } from "../services/api";
export const useBooks = (enabled: boolean) =>
  useQuery({
    queryKey: ["owners"],
    queryFn: getOwners,
    enabled,
    retry: (failureCount: number, error: unknown) =>
      failureCount < 2 &&
      !(axios.isAxiosError(error) && error.response?.status === 429),
  });
