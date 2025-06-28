"use client";

import { CartProductProps, ProductProps } from "@/utils/props";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { useCartContext } from "@/hooks/CartContextProvider";
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
  products: ProductProps[];
}

export const ProductCard = ({ products }: ProductCardProps) => {
  const { cartProducts, setCartProducts } = useCartContext();
  const [isClient, setIsClient] = useState(false); // Usado para evitar erro de hidratação no next.js

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToCart = (product: ProductProps, productVariation: string) => {
    // Criar o novo produto à ser adicionado no carrinho de compras
    const newCartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      variation: productVariation || "",
      imageUrl: product.images[0].url,
    };

    // Verificar se já existe no sessionStorage o armazenamento 'cart'
    const cartExist = sessionStorage.getItem("cart");

    if (cartExist) {
      const cart: CartProductProps[] = JSON.parse(cartExist); // Pegar os dados armazenados no 'cart'

      let productExistInCart = false;

      cart.map((cartProduct) => {
        if (
          cartProduct.id === newCartProduct.id &&
          cartProduct.variation === newCartProduct.variation
        ) {
          cartProduct.quantity += newCartProduct.quantity; // Nova quantidade do produto

          sessionStorage.setItem("cart", JSON.stringify(cart)); // Atualizar no sessionStorage o 'cart'
          setCartProducts(cart);

          productExistInCart = true;
        }
      });

      if (productExistInCart) return; // Termina aqui a function se o produto já estiver no carrinho

      cart.push(newCartProduct); // Adicionar o novo produto ao 'cart'

      sessionStorage.setItem("cart", JSON.stringify(cart)); // Atualizar no sessionStorage o 'cart'
      setCartProducts(cart);
    } else {
      sessionStorage.setItem("cart", JSON.stringify([newCartProduct])); // Criar o armazenamento 'cart' no sessionStorage
      setCartProducts([newCartProduct]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => {
        let productVariation = product.variations[0];
        let productQuantityInCart = 0;

        return (
          <div key={index} className="space-y-4">
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

                {isClient &&
                  cartProducts.map((cartProduct, index) => {
                    if (cartProduct.id === product.id) {
                      productQuantityInCart += cartProduct.quantity;

                      return (
                        <p
                          key={index}
                          className="z-10 absolute flex items-center justify-center size-6 text-white bg-red-500 rounded-full"
                        >
                          {productQuantityInCart}
                        </p>
                      );
                    }
                  })}
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                    }}
                    className="flex items-center gap-1"
                  >
                    {product.variations.length > 0 && (
                      <Select
                        defaultValue={productVariation}
                        onValueChange={(value) => (productVariation = value)}
                      >
                        <SelectTrigger className="cursor-pointer z-20">
                          <SelectValue placeholder={productVariation} />
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
                      onClick={() => addToCart(product, productVariation)}
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
      })}
    </div>
  );
};
