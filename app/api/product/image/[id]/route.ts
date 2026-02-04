import { db } from "@/db";
import {
  imagesProductsTable,
  InsertImageProduct,
  productsTable,
} from "@/db/schema";
import cloudinary from "@/lib/server/cloudinary";
import { uploadImage } from "@/lib/server/services/upload-image.service";
import { eq } from "drizzle-orm";

export async function POST(
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

    // Verificar que el producto existe
    const [existingProduct] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!existingProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Obtener el archivo del formData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "File is required" }, { status: 400 });
    }

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }

    // Subir la imagen a Cloudinary
    const uploadResult = await uploadImage(file, "products");

    // Crear el registro en la base de datos
    const newImage: InsertImageProduct = {
      productId,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };

    const [imageProduct] = await db
      .insert(imagesProductsTable)
      .values(newImage)
      .returning();

    return Response.json({ image: imageProduct }, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    // Validar que el ID sea un número válido
    if (isNaN(productId)) {
      return Response.json({ error: "Invalid image ID" }, { status: 400 });
    }

    // Verificar que la imagen existe
    const [existingImage] = await db
      .select()
      .from(imagesProductsTable)
      .where(eq(imagesProductsTable.id, productId));

    if (!existingImage) {
      return Response.json({ error: "Image not found" }, { status: 404 });
    }

    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(existingImage.publicId);

    // Eliminar el registro de la base de datos
    await db
      .delete(imagesProductsTable)
      .where(eq(imagesProductsTable.id, productId));

    return Response.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return Response.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
