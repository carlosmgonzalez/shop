import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserSessionResponse {
  session: {
    id: number;
    token: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

export function useInitSession() {
  return useQuery<UserSessionResponse>({
    queryKey: ["user-session"],
    queryFn: async () => {
      const response = await axios.get<UserSessionResponse>("/api/user-session", {
        withCredentials: true, // Asegura que las cookies se envíen
      });
      return response.data;
    },
    staleTime: Infinity, // La sesión no se vuelve "stale" nunca
    gcTime: Infinity, // No eliminar del cache
    retry: 1, // Solo reintentar una vez si falla
  });
}
