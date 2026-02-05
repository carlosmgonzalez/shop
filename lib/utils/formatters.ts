/**
 * Formatea un precio en formato de pesos argentinos
 * @param price - Precio a formatear
 * @returns Precio formateado como string (ej: "$1.234,56")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
