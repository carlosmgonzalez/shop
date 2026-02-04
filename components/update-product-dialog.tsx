"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  useUpdateProduct,
  useUploadProductImage,
  useDeleteProductImage,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductType } from "@/db/schema";
import { numberInputTransform } from "@/lib/utils/transforms";
import { ImageOff, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductDataType } from "@/interfaces";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less")
    .optional(),
  price: z
    .number({ error: "Price must be a number" })
    .int("Price must be an integer")
    .positive("Price must be a positive number")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  stock: z
    .number({ error: "Stock must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateProductDialogProps {
  product: ProductDataType;
}

export function UpdateProductDialog({ product }: UpdateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadProductImage();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteProductImage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    form.reset({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
  }, [product, form]);

  function onSubmit(data: FormValues) {
    const updatedProduct: ProductType = {
      ...product,
      ...data,
    };

    updateProduct(updatedProduct, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(
        { productId: product.id, file },
        {
          onSuccess: () => {
            // Reset input to allow selecting the same file again
            event.target.value = "";
          },
        }
      );
    }
  }

  function handleImageDelete(imageId: number) {
    deleteImage({ imageId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer text-left w-full">
          <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <ImageOff className="size-12 text-muted-foreground" />
            )}
          </div>
          <div className="w-full">
            <h3 className="font-semibold text-sm">{product.name}</h3>
            <p className="text-sm text-muted-foreground">${product.price}</p>
            <p className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Update the product information. All fields are optional.
          </DialogDescription>
        </DialogHeader>
        <form id="update-product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Product name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">Price</FieldLabel>
                  <Input
                    id="product-price"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                    min={1}
                    value={numberInputTransform.input(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(numberInputTransform.output(e))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="product-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Product description"
                    rows={4}
                    className="min-h-[100px] resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
                  <Input
                    id="product-stock"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                    min={0}
                    value={numberInputTransform.input(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(numberInputTransform.output(e))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="product-image-upload">
                Product Images
              </FieldLabel>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={isUploading}
                >
                  <label
                    htmlFor="product-image-upload"
                    className="cursor-pointer"
                  >
                    <Plus className="size-4" />
                    {isUploading ? "Uploading..." : "Add Image"}
                  </label>
                </Button>
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square bg-muted rounded-md overflow-hidden group"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} image`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        size="icon-xs"
                        onClick={() => handleImageDelete(image.id)}
                        disabled={isDeleting}
                        className="absolute top-1 right-1 rounded-full z-10"
                        aria-label="Delete image"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="update-product-form"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
