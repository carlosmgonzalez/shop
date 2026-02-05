"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { InsertProduct } from "@/db/schema";
import { numberInputTransform } from "@/lib/utils/transforms";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  price: z
    .number({ error: "Price must be a number" })
    .int("Price must be an integer")
    .positive("Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  stock: z
    .number({ error: "Stock must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number"),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProductDialog() {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      value={numberInputTransform.input(field.value)}
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
                      value={numberInputTransform.input(field.value)}
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
            </FieldGroup>
          </form>
        </div>
        <DialogFooter className="shrink-0">
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
          <Button type="submit" form="create-product-form" disabled={isPending}>
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
