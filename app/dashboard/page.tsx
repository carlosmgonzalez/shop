"use client";

import * as React from "react";
import { useGetProducts } from "@/hooks";
import { NewProductDialog } from "@/components/new-product-dialog";
import { UpdateProductDialog } from "@/components/update-product-dialog";

export default function Dashboard() {
  const { data: products } = useGetProducts();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1>Dashboard</h1>
        <NewProductDialog />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <UpdateProductDialog key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
