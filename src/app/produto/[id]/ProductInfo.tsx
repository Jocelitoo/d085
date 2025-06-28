"use client";

// import { Rating } from "@/components/Rating";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { ProductProps } from "@/utils/props";
// import { VariationRadio } from "./VariationRadio";
import { AddToCartButton } from "./AddToCartButton";
import { QuantityInput } from "./QuantityInput";
import { VariationRadio } from "./VariationRadio";

interface ProductInfoProps {
  product: ProductProps;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const [productVariation, setProductVariation] = useState(
    product.variations[0]
  );

  return (
    <div className="space-y-3">
      <p className="text-3xl">{product.name}</p>

      <p className="font-semibold text-xl">
        R$ {(product.price / 100).toFixed(2)}
      </p>

      <p className="text-sm">{product.description}</p>

      <p>
        <span className="font-semibold uppercase">Categória:</span>{" "}
        {product.category}
      </p>

      <VariationRadio
        product={product}
        setProductVariation={setProductVariation}
      />

      <Separator />

      <QuantityInput
        productQuantity={productQuantity}
        // productVariation={productVariation}
        setProductQuantity={setProductQuantity}
      />

      <Separator />

      <AddToCartButton
        product={product}
        productQuantity={productQuantity}
        productVariation={productVariation}
        setProductQuantity={setProductQuantity}
      />
    </div>
  );
};
