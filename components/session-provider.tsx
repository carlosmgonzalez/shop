"use client";

import { useInitSession } from "@/hooks/use-init-session";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data, error } = useInitSession();

  useEffect(() => {
    if (error) {
      console.error("Error initializing session:", error);
    }
  }, [error]);

  // Este componente solo inicializa la sesión, no bloquea el renderizado
  return <>{children}</>;
}
