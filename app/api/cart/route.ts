import { db } from "@/db";
import { usersSessionsTable, cartTable, cartItemsTable } from "@/db/schema";
import { cookies } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const addCartItemSchema = z.object({
  productId: z
    .number()
    .int("productId must be an integer")
    .positive("productId must be a positive number"),
  quantity: z
    .number()
    .int("quantity must be an integer")
    .refine((val) => val !== 0, {
      message: "quantity cannot be zero",
    }),
});

export async function GET() {
  try {
    // Obtener el token de sesión de las cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return Response.json(
        { error: "Session token not found" },
        { status: 401 }
      );
    }

    // Buscar la sesión de usuario por token
    const userSession = await db.query.usersSessionsTable.findFirst({
      where: eq(usersSessionsTable.token, sessionToken),
    });

    if (!userSession) {
      return Response.json({ error: "Invalid session token" }, { status: 401 });
    }

    // Buscar el carrito asociado a la sesión de usuario
    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userSessionId, userSession.id),
      with: {
        items: {
          with: {
            product: {
              with: {
                images: true,
              },
            },
          },
          orderBy: desc(cartItemsTable.createdAt),
        },
      },
    });

    // Si no existe carrito, retornar un array vacío
    if (!cart) {
      return Response.json({ items: [] }, { status: 200 });
    }

    // Retornar los items del carrito
    return Response.json({ items: cart.items }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Obtener el token de sesión de las cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return Response.json(
        { error: "Session token not found" },
        { status: 401 }
      );
    }

    // Buscar la sesión de usuario por token
    const userSession = await db.query.usersSessionsTable.findFirst({
      where: eq(usersSessionsTable.token, sessionToken),
    });

    if (!userSession) {
      return Response.json({ error: "Invalid session token" }, { status: 401 });
    }

    // Obtener el body de la petición
    const body = await request.json();

    // Validar el body con Zod
    const validationResult = addCartItemSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { productId, quantity: quantityNum } = validationResult.data;

    // Buscar o crear el carrito asociado a la sesión de usuario
    let cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userSessionId, userSession.id),
    });

    if (!cart) {
      // Crear un nuevo carrito si no existe
      const [newCart] = await db
        .insert(cartTable)
        .values({ userSessionId: userSession.id })
        .returning();
      cart = newCart;
    }

    // Buscar si ya existe un itemCart con ese productId en el carrito
    const existingItem = await db.query.cartItemsTable.findFirst({
      where: and(
        eq(cartItemsTable.cartId, cart.id),
        eq(cartItemsTable.productId, productId)
      ),
    });

    if (existingItem) {
      // Si la cantidad es negativa, verificar que no exceda la cantidad existente
      if (quantityNum < 0 && Math.abs(quantityNum) > existingItem.quantity) {
        return Response.json(
          {
            error: `Cannot remove ${Math.abs(quantityNum)} items. Only ${
              existingItem.quantity
            } items in cart`,
          },
          { status: 400 }
        );
      }

      // Calcular la nueva cantidad
      const newQuantity = existingItem.quantity + quantityNum;

      // Si la cantidad resultante es menor o igual a 0, eliminar el item
      if (newQuantity <= 0) {
        await db
          .delete(cartItemsTable)
          .where(eq(cartItemsTable.id, existingItem.id));

        return Response.json(
          { message: "Item removed from cart", item: null },
          { status: 200 }
        );
      }

      // Actualizar la cantidad del item existente
      const [updatedItem] = await db
        .update(cartItemsTable)
        .set({ quantity: newQuantity })
        .where(eq(cartItemsTable.id, existingItem.id))
        .returning();

      return Response.json(
        { message: "Cart item updated", item: updatedItem },
        { status: 200 }
      );
    } else {
      // Si no existe el item y la cantidad es negativa, retornar error
      if (quantityNum <= 0) {
        return Response.json(
          {
            error: "Cannot add negative quantity to non-existent cart item",
          },
          { status: 400 }
        );
      }

      // Crear un nuevo itemCart
      const [newItem] = await db
        .insert(cartItemsTable)
        .values({
          cartId: cart.id,
          productId: productId,
          quantity: quantityNum,
        })
        .returning();

      return Response.json(
        { message: "Item added to cart", item: newItem },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
