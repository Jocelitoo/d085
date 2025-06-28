"use client";

import { ProductProps } from "@/utils/props";
import Image from "next/image";
import React from "react";

interface ProductImageProps {
  product: ProductProps;
}

export const ProductImage = ({ product }: ProductImageProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="aspect-square overflow-hidden relative w-full bg-slate-200 rounded-md">
        <Image
          src={product.images[0].url}
          alt={product.name}
          fill
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
