"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { ProductCard } from "@/components/product-card";
import { useGetProducts, useCreateProduct } from "@/hooks";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InsertProduct } from "@/db/schema";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  price: z.coerce
    .number("Price must be a number")
    .int("Price must be an integer")
    .positive("Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  stock: z.coerce
    .number("Stock must be a number")
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const { data: products } = useGetProducts();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
    },
  });

  function onSubmit(data: FormValues) {
    const productData: InsertProduct = {
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
    };

    createProduct(productData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your store. Fill in all the required
                fields.
              </DialogDescription>
            </DialogHeader>
            <form
              id="create-product-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
                      <FieldDescription>
                        Enter the product name (max 255 characters).
                      </FieldDescription>
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
                        {...field}
                        id="product-price"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        autoComplete="off"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                        value={field.value as string}
                      />
                      <FieldDescription>
                        Enter the product price as a positive integer.
                      </FieldDescription>
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
                      <FieldDescription>
                        Provide a detailed description of the product.
                      </FieldDescription>
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
                        {...field}
                        id="product-stock"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        autoComplete="off"
                        min={0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                        value={field.value as string}
                      />
                      <FieldDescription>
                        Enter the available stock quantity.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
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
                form="create-product-form"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
