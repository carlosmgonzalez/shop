import { z } from "zod";
import { db } from "@/db";
import { productsTable, InsertProduct } from "@/db/schema";

const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number")
    .default(0),
});

export async function GET() {
  try {
    const products = await db.query.productsTable.findMany({
      with: {
        images: true,
      },
    });

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = createProductSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const newProduct: InsertProduct = validationResult.data;

    const [product] = await db
      .insert(productsTable)
      .values(newProduct)
      .returning();

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
