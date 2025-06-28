import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/CartContextProvider";
import { CartProductProps, ProductProps } from "@/utils/props";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: ProductProps;
  productQuantity: number;
  productVariation: string;
  setProductQuantity: Dispatch<SetStateAction<number>>;
}

export const AddToCartButton = ({
  product,
  productQuantity,
  productVariation,
  setProductQuantity,
}: AddToCartButtonProps) => {
  const { setCartProducts } = useCartContext();

  const addToCart = () => {
    // Criar o novo produto à ser adicionado no carrinho de compras
    const newCartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: productQuantity,
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

          toast("Produto adicionado ao carrinho", {
            style: { backgroundColor: "#07bc0c", color: "#000" },
          });

          productExistInCart = true;
          setProductQuantity(0);
        }
      });

      if (productExistInCart) return; // Termina aqui a function se o produto já estiver no carrinho

      cart.push(newCartProduct); // Adicionar o novo produto ao 'cart'

      sessionStorage.setItem("cart", JSON.stringify(cart)); // Atualizar no sessionStorage o 'cart'
      setCartProducts(cart);

      setProductQuantity(0);
      toast("Produto adicionado ao carrinho", {
        style: { backgroundColor: "#07bc0c", color: "#000" },
      });
    } else {
      sessionStorage.setItem("cart", JSON.stringify([newCartProduct])); // Criar o armazenamento 'cart' no sessionStorage
      setCartProducts([newCartProduct]);

      toast("Produto adicionado ao carrinho", {
        style: { backgroundColor: "#07bc0c", color: "#000" },
      });
    }
  };

  return (
    <Button
      variant={"ghost"}
      size={"lg"}
      disabled={productQuantity <= 0}
      onClick={() => addToCart()}
      className="w-full bg-green-300 duration-300 cursor-pointer  hover:bg-green-500"
    >
      Adicionar ao carrinho
    </Button>
  );
};
