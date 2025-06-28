import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { Dispatch } from "react";

interface QuantityInputProps {
  productQuantity: number;
  setProductQuantity: Dispatch<React.SetStateAction<number>>;
}

export const QuantityInput = ({
  productQuantity,
  setProductQuantity,
}: QuantityInputProps) => {
  return (
    <div className="flex items-center gap-4">
      <p className="font-semibold uppercase">Quantidade:</p>

      <div className="flex gap-2">
        <Button
          size={"sm"}
          disabled={productQuantity <= 0}
          className="cursor-pointer rounded-full"
          onClick={() => {
            setProductQuantity(productQuantity - 1);
          }}
        >
          -
        </Button>

        <Input
          type="number"
          min={1}
          max={99}
          value={productQuantity}
          onChange={(event) => {
            const newProductQuantity = Number(event.target.value); // Transformar a string em número

            setProductQuantity(newProductQuantity);
          }}
          className="max-w-24"
        />

        <Button
          size={"sm"}
          className="cursor-pointer rounded-full"
          onClick={() => {
            setProductQuantity(productQuantity + 1);
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
};
