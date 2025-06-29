"use client";

import { CartProductProps, ProductProps } from "@/utils/props";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProductCardProps {
  product: ProductProps;
  cartProducts: CartProductProps[];
  isClient: boolean;
  addToCart: (product: ProductProps, productVariation: string) => void;
}

export const ProductCard = ({
  product,
  cartProducts,
  isClient,
  addToCart,
}: ProductCardProps) => {
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations[0]
  );

  // Quantidade do produto no carrinho
  const productQuantityInCart = isClient
    ? cartProducts
        .filter((cp) => cp.id === product.id)
        .reduce((acc, cp) => acc + cp.quantity, 0)
    : 0;

  return (
    <div className="space-y-4">
      <Link
        href={`/produto/${product.id}`}
        className="flex gap-2 sm:gap-0 overflow-hidden sm:flex-col sm:border sm:rounded-md  "
      >
        <div className="aspect-square overflow-hidden relative w-1/2 rounded-md sm:w-full">
          <Image
            src={product.images[0].url}
            fill
            alt={product.name}
            className="w-full h-full"
          />

          {productQuantityInCart > 0 && (
            <p className="z-10 absolute flex items-center justify-center size-6 text-white bg-red-500 rounded-full">
              {productQuantityInCart}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col justify-between line-clamp-1 sm:p-4">
          <p className="break-words">{product.name}</p>

          <div className="flex items-center justify-between gap-6">
            <p className="font-semibold text-xl">
              R$ {(product.price / 100).toFixed(2)}
            </p>

            <div
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex items-center gap-1"
            >
              {selectedVariation && (
                <Select
                  defaultValue={selectedVariation}
                  onValueChange={(value) => setSelectedVariation(value)}
                >
                  <SelectTrigger className="cursor-pointer z-20">
                    <SelectValue placeholder={selectedVariation} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tamanho</SelectLabel>
                      {product.variations.map((variation, index) => {
                        return (
                          <SelectItem key={index} value={variation}>
                            {variation}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              <Button
                size={"icon"}
                className="rounded-full z-10 cursor-pointer"
                onClick={() => addToCart(product, selectedVariation)}
              >
                +<span className="sr-only">Adicionar ao carrinho</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <Separator className="sm:hidden" />
    </div>
  );
};
