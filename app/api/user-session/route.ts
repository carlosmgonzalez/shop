import { cookies } from "next/headers";
import { db } from "@/db";
import { usersSessionsTable, InsertUserSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("session_token")?.value;

    // Si ya existe el token, buscar la sesión en la base de datos
    if (existingToken) {
      const userSession = await db.query.usersSessionsTable.findFirst({
        where: eq(usersSessionsTable.token, existingToken),
      });

      if (userSession) {
        return Response.json(
          { session: userSession, token: existingToken },
          { status: 200 }
        );
      }
    }

    // Si no existe el token o la sesión no es válida, crear uno nuevo
    const newToken = randomUUID();

    // Crear la sesión en la base de datos
    const newSession: InsertUserSession = {
      token: newToken,
    };

    const [userSession] = await db
      .insert(usersSessionsTable)
      .values(newSession)
      .returning();

    // Establecer la cookie con el nuevo token
    cookieStore.set("session_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 año
      path: "/",
    });

    return Response.json(
      { session: userSession, token: newToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error managing user session:", error);
    return Response.json(
      { error: "Failed to manage user session" },
      { status: 500 }
    );
  }
}
