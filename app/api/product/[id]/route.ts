import { z } from "zod";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Schema de validación para actualizar un producto (todos los campos opcionales)
const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less")
    .optional(),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be a positive number")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    // Validar que el ID sea un número válido
    if (isNaN(productId)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    // Validar que el ID sea un número válido
    if (isNaN(productId)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validar los datos con Zod
    const validationResult = updateProductSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const [existingProduct] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!existingProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Actualizar el producto solo con los campos proporcionados
    const [updatedProduct] = await db
      .update(productsTable)
      .set(validationResult.data)
      .where(eq(productsTable.id, productId))
      .returning();

    return Response.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
