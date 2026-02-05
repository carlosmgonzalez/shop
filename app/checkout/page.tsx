"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useGetCart } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils/formatters";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { MapPin, Truck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DELIVERY_FREE_THRESHOLD = 30000;
const DELIVERY_COST = 5000; // Costo de envío si no alcanza el mínimo

const deliveryFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  email: z
    .email("El email no es válido")
    .min(1, "El email es requerido")
    .max(255, "El email debe tener menos de 255 caracteres"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono debe contener solo números"),
  address: z
    .string()
    .min(1, "La dirección es requerida")
    .max(500, "La dirección debe tener menos de 500 caracteres"),
  city: z.string().min(1, "La ciudad es requerida"),
  postalCode: z
    .string()
    .min(1, "El código postal es requerido")
    .regex(/^[0-9]+$/, "El código postal debe contener solo números"),
  notes: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

type DeliveryOption = "pickup" | "delivery";

export default function CheckoutPage() {
  const { data: cart, isLoading: isLoadingCart } = useGetCart();
  const [deliveryOption, setDeliveryOption] =
    React.useState<DeliveryOption>("pickup");

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "Ciudad de Buenos Aires",
      postalCode: "",
      notes: "",
    },
  });

  // Calcular el total del carrito
  const cartTotal =
    cart?.items.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      return acc + price * item.quantity;
    }, 0) || 0;

  // Determinar si el envío es gratis
  const isDeliveryFree = cartTotal >= DELIVERY_FREE_THRESHOLD;
  const deliveryCost = isDeliveryFree ? 0 : DELIVERY_COST;
  const finalTotal =
    cartTotal + (deliveryOption === "delivery" ? deliveryCost : 0);

  function onSubmitDelivery(data: DeliveryFormValues) {
    // Aquí iría la lógica para procesar el pedido con envío
    console.log("Datos de envío:", data);
    console.log("Total:", finalTotal);
  }

  function onSubmitPickup() {
    // Aquí iría la lógica para procesar el pedido con retiro
    console.log("Retiro en tienda");
    console.log("Total:", cartTotal);
  }

  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Carrito vacío</h1>
          <p className="text-muted-foreground">
            No hay productos en tu carrito para finalizar la compra.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

        {/* Opciones de entrega */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Opción 1: Retiro en tienda */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              deliveryOption === "pickup" &&
                "border-primary ring-2 ring-primary/20"
            )}
            onClick={() => setDeliveryOption("pickup")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                    deliveryOption === "pickup"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {deliveryOption === "pickup" && (
                    <Check className="size-3 text-primary-foreground" />
                  )}
                </div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  Retiro en tienda
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="space-y-2">
                <p className="font-medium text-foreground">Uriburu 411</p>
                <p className="text-sm">
                  Horario: Lunes a Viernes de 8:00 a 18:00 hs
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Opción 2: Envío */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              deliveryOption === "delivery" &&
                "border-primary ring-2 ring-primary/20"
            )}
            onClick={() => setDeliveryOption("delivery")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                    deliveryOption === "delivery"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {deliveryOption === "delivery" && (
                    <Check className="size-3 text-primary-foreground" />
                  )}
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="size-5" />
                  Envío a domicilio
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="space-y-2">
                <p className="font-medium text-foreground">
                  Solo Ciudad de Buenos Aires (CABA)
                </p>
                <p className="text-sm">
                  {isDeliveryFree ? (
                    <span className="text-green-600 font-medium">
                      Envío gratis
                    </span>
                  ) : (
                    <span>
                      Envío: {formatPrice(DELIVERY_COST)} (Gratis superando{" "}
                      {formatPrice(DELIVERY_FREE_THRESHOLD)})
                    </span>
                  )}
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de envío */}
        {deliveryOption === "delivery" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Datos de envío</CardTitle>
              <CardDescription>
                Completa tus datos para recibir el pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="delivery-form"
                onSubmit={form.handleSubmit(onSubmitDelivery)}
              >
                <FieldGroup>
                  <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="full-name">
                          Nombre completo
                        </FieldLabel>
                        <Input
                          {...field}
                          id="full-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Juan Pérez"
                          autoComplete="name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="juan.perez@example.com"
                          autoComplete="email"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          aria-invalid={fieldState.invalid}
                          placeholder="11 1234-5678"
                          autoComplete="tel"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="address">Dirección</FieldLabel>
                        <Input
                          {...field}
                          id="address"
                          aria-invalid={fieldState.invalid}
                          placeholder="Calle y número"
                          autoComplete="street-address"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      name="city"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="city">Ciudad</FieldLabel>
                          <Input
                            {...field}
                            id="city"
                            aria-invalid={fieldState.invalid}
                            placeholder="Ciudad de Buenos Aires"
                            autoComplete="address-level2"
                            disabled
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="postalCode"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="postal-code">
                            Código postal
                          </FieldLabel>
                          <Input
                            {...field}
                            id="postal-code"
                            aria-invalid={fieldState.invalid}
                            placeholder="1234"
                            autoComplete="postal-code"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <Controller
                    name="notes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="notes">
                          Notas adicionales (opcional)
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="notes"
                          aria-invalid={fieldState.invalid}
                          placeholder="Referencias, timbre, etc."
                          rows={3}
                          className="resize-none"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Resumen del pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cart.items.map((item) => {
                const itemTotal = (item.product.price ?? 0) * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price ?? 0)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(itemTotal)}</p>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {deliveryOption === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {isDeliveryFree ? (
                      <span className="text-green-600 font-medium">Gratis</span>
                    ) : (
                      formatPrice(deliveryCost)
                    )}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Button
              type={deliveryOption === "delivery" ? "submit" : "button"}
              form={deliveryOption === "delivery" ? "delivery-form" : undefined}
              onClick={deliveryOption === "pickup" ? onSubmitPickup : undefined}
              className="w-full mt-6"
              size="lg"
            >
              Confirmar pedido
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
