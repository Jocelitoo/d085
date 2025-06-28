import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductProps } from "@/utils/props";
import React, { Dispatch } from "react";

interface VariationRatioProps {
  product: ProductProps;
  setProductVariation: Dispatch<React.SetStateAction<string>>;
}

export const VariationRadio: React.FC<VariationRatioProps> = ({
  product,
  setProductVariation,
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="font-semibold uppercase">Tamanho:</p>

      <RadioGroup defaultValue="size-0" className="grid grid-cols-3 gap-4 ">
        {product.variations.map((variation, index) => {
          return (
            <div key={index}>
              <RadioGroupItem
                value={`size-${index}`}
                onClick={() => {
                  setProductVariation(variation);
                }}
                id={`size-${index}`}
                className="hidden peer"
              />

              <Label
                htmlFor={`size-${index}`}
                className="border-2 rounded-md cursor-pointer block py-2 px-4 peer-aria-checked:bg-slate-200"
              >
                {variation}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
