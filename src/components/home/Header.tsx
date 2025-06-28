"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { useCartContext } from "@/hooks/CartContextProvider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Image from "next/image";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import Link from "next/link";

export const Header = () => {
  const { cartProducts, setCartProducts } = useCartContext(); // Pega os produtos no carrinho

  // Calcular o VALOR total dos produtos no carrinho
  const totalPrice = cartProducts.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  // Calcular a QUANTIDADE total dos produtos no carrinho
  const totalQuantity = cartProducts.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  const deleteProduct = (productId: string, productVariation?: string) => {
    // Pegar os produtos que NÃO tem o mesmo id e size do produto à ser deletado
    const updatedCartProducts = cartProducts.filter((cartProduct) => {
      if (cartProduct.id === productId) {
        if (cartProduct.variation === productVariation) return;

        return cartProduct;
      }

      return cartProduct;
    });

    // Salvar as alterações
    sessionStorage.setItem("cart", JSON.stringify(updatedCartProducts)); // Salva na sessionStorage o produto atualizado
    setCartProducts(updatedCartProducts); // Usamos para vermos a mudança em tempo real
  };

  const clearCart = () => {
    sessionStorage.removeItem("cart");
    setCartProducts([]); // Usamos para vermos a mudança em tempo real
  };

  const alterQuantity = (
    productId: string,
    newQuantity: number,
    productVariation?: string
  ) => {
    // Se a nova quantidade do produto for 0, então remova ele
    if (newQuantity <= 0) {
      deleteProduct(productId, productVariation);
      return;
    }

    // Atualizar o produto com a nova quantidade
    const updatedCartProducts = cartProducts.map((cartProduct) => {
      // Verificar se o produto que está sofrendo map tem o mesmo id e size do produto que vai receber alteração
      if (
        cartProduct.id === productId &&
        cartProduct.variation === productVariation
      ) {
        // Clonar o produto e atualizar seus dados que sofreram alteração
        const updatedProduct = {
          ...cartProduct,
          quantity: newQuantity,
        };

        return updatedProduct; // Retorna o produto atualizado
      }

      return cartProduct;
    });

    // Salvar as alterações
    sessionStorage.setItem("cart", JSON.stringify(updatedCartProducts)); // Salva na sessionStorage o produto atualizado
    setCartProducts(updatedCartProducts); // Usamos para vermos a mudança em tempo real
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white flex justify-between items-center p-4 border-b sm:px-8 lg:px-20">
      <Link href={"/"} className="font-bold">
        D085 Suplementos
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"lg"}
            variant={"outline"}
            className="relative cursor-pointer"
          >
            <ShoppingBag />

            {totalQuantity !== 0 && (
              <p className="z-10 absolute top-[-10px] right-[-10px] flex items-center justify-center size-6 text-white bg-red-500 rounded-full">
                {totalQuantity}
              </p>
            )}

            {totalPrice > 0 && <p>R$ {(totalPrice / 100).toFixed(2)}</p>}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-8/10 min-w-[300px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Sacola</SheetTitle>
          </SheetHeader>

          {cartProducts.length === 0 ? (
            <div className="grow flex flex-col items-center justify-center gap-4 ">
              <p className="text-3xl font-bold">Sacola vazia</p>

              <SheetClose asChild>
                <Button
                  size={"lg"}
                  variant={"outline"}
                  className=" border-black rounded-full cursor-pointer hover:bg-slate-200"
                >
                  Voltar ao catalogo
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-end">
                  <Button
                    variant={"outline"}
                    onClick={clearCart}
                    className="cursor-pointer"
                  >
                    Limpar sacola
                  </Button>
                </div>

                <div className="flex justify-between items-center px-4 ">
                  <p>
                    {totalQuantity} produto{totalQuantity > 1 && "s"}
                  </p>

                  <p className="text-xl font-semibold">
                    R$ {(totalPrice / 100).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-4 ">
                  <Separator />

                  {cartProducts.map((cartProduct, index) => {
                    return (
                      <div key={index} className="space-y-4">
                        <div className="flex px-4 gap-1">
                          <div className="aspect-square overflow-hidden relative w-full max-w-[80px] rounded-md sm:w-full">
                            <Image
                              src={cartProduct.imageUrl}
                              fill
                              alt={cartProduct.name}
                              className="w-full h-full"
                            />
                          </div>

                          <div className="w-full">
                            <p>
                              {cartProduct.name}{" "}
                              {cartProduct.variation && (
                                <span>({cartProduct.variation})</span>
                              )}
                            </p>
                            <p>R$ {(cartProduct.price / 100).toFixed(2)}</p>

                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size={"sm"}
                                disabled={cartProduct.quantity <= 0}
                                className="cursor-pointer rounded-full"
                                onClick={() => {
                                  alterQuantity(
                                    cartProduct.id,
                                    cartProduct.quantity - 1,
                                    cartProduct.variation
                                  );
                                }}
                              >
                                -
                              </Button>

                              <Input
                                type="number"
                                min={1}
                                max={99}
                                value={cartProduct.quantity}
                                onChange={(event) =>
                                  alterQuantity(
                                    cartProduct.id,
                                    Number(event.target.value),
                                    cartProduct.variation
                                  )
                                }
                                className="max-w-16"
                              />

                              <Button
                                size={"sm"}
                                className="cursor-pointer rounded-full"
                                onClick={() => {
                                  alterQuantity(
                                    cartProduct.id,
                                    cartProduct.quantity + 1,
                                    cartProduct.variation
                                  );
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="button"
                    asChild
                    className="bg-green-300 text-black hover:bg-green-500"
                  >
                    <Link href={"/checkout"}>Avançar</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
};
