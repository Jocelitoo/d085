"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/hooks/CartContextProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getCoupon } from "@/actions/couponActions";
import { toast } from "sonner";
import { checkoutFormSchema } from "@/lib/schema";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  neighborhoods: {
    name: string;
    id: string;
    createdAt: Date;
    price: number;
  }[];
  wpp: { number: string };
}

export const CheckoutForm = ({ neighborhoods, wpp }: CheckoutFormProps) => {
  const { cartProducts } = useCartContext();
  const [deliver, setDeliver] = useState("Retirar na loja");
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [couponName, setCouponName] = useState("");
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Verificar se o usuário está acessando no desktop ou celular
  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "" : navigator.userAgent;
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  // Calcular o VALOR total dos produtos no carrinho
  const subtotal = cartProducts.reduce(
    (acc, product) => (acc += product.price * product.quantity),
    0
  );

  // Calcular a QUANTIDADE total dos produtos no carrinho
  const totalQuantity = cartProducts.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  if (totalQuantity === 0) redirect("/"); // Redirecionar para a home caso não tenha produtos no carrinho

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      deliver: "Retirar na loja",
      paymentMethod: "Dinheiro",
      neighborhood: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    const message = `D085 SUPLEMENTOS 

---------------------------

Nome: ${values.name}
telefone: ${values.phone}
Forma de retirada: ${values.deliver}
 ${
   deliver === "Entrega"
     ? `
Bairro: ${neighborhoodName} 
Endereço: ${values.address}
  `
     : ""
 }

---------------------------

PRODUTOS:
${cartProducts.map((product) => {
  return `
  - ${product.quantity}x ${product.name} ${
    product.variation && `(${product.variation})`
  } - R$ ${((product.price * product.quantity) / 100).toFixed(2)}`;
})}

---------------------------

Forma de pagamento: ${values.paymentMethod}

${
  discount < 1
    ? `Cupom ${couponName} aplicado: ${100 - discount * 100}% de desconto`
    : "Sem desconto"
}

${
  deliver === "Entrega"
    ? `Taxa de entrega: R$ ${deliveryPrice.toFixed(2)}`
    : "Sem taxa de entrega"
}

Total: R$ ${((Number(subtotal) * discount + deliveryPrice) / 100).toFixed(2)}`;

    location.assign(
      `https://${isMobile ? "api" : "web"}.whatsapp.com/send?phone=${
        wpp.number
      }&text=${encodeURIComponent(message)}`
    );
  }

  // Observar alterações no neighborhoodName para em caso de mudança, alterar a taxa de entrega
  useEffect(() => {
    if (neighborhoodName) {
      // Pegar os dados do bairro selecionado
      const selectedNeighborhood = neighborhoods.find(
        (neighborhood) => neighborhood.name === neighborhoodName
      );

      // Alterar a taxa de entrega
      if (selectedNeighborhood) setDeliveryPrice(selectedNeighborhood.price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neighborhoodName]);

  const handlerGetCoupon = () => {
    setLoading(true);

    getCoupon(couponName)
      .then((response) => {
        setDiscount(response);
        toast("Desconto aplicado", {
          style: { backgroundColor: "#07bc0c", color: "#000" },
        });
      })
      .catch((error) =>
        toast(error.message, {
          style: { backgroundColor: "#e74c3c", color: "#000" },
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-8 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-lg border p-4 rounded-md mx-auto"
        >
          <p className="text-center font-semibold text-2xl">
            Dados para pagamento
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Nome do usuário
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="91234-5678" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Número de celular
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de entrega:</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value: "Retirar na loja" | "Entrega") => {
                      form.setValue("deliver", value);
                      setDeliver(value);

                      // Resetar a taxa de entrega e o nome do bairro selecionado em caso de alteração
                      setDeliveryPrice(0);
                      setNeighborhoodName("");
                      form.setValue("neighborhood", "");
                      form.setValue("address", "");
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Forma de entrega" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Forma de entrega</SelectLabel>
                        <SelectItem value="Entrega">Entrega</SelectItem>
                        <SelectItem value="Retirar na loja">
                          Retirar na loja
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="sr-only">
                  Forma de entrega
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {deliver === "Entrega" && (
            <>
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro:</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setNeighborhoodName(value);
                        form.setValue("neighborhood", value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border p-2 rounded-md text-start">
                          <SelectValue placeholder="Selecione uma categória" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {neighborhoods.map((neighborhood, index) => {
                          return (
                            <SelectItem key={index} value={neighborhood.name}>
                              {neighborhood.name} - R${" "}
                              {(neighborhood.price / 100).toFixed(2)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription className="sr-only">
                      Bairro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço:</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Endereço
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento:</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(
                      value: "Dinheiro" | "Pix" | "Débito" | "Crédito"
                    ) => {
                      form.setValue("paymentMethod", value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Forma de pagamento</SelectLabel>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Pix">Pix</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="sr-only">
                  Forma de pagamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Input
              type="text"
              defaultValue={couponName}
              onChange={(event) => setCouponName(event.target.value)}
            />

            <Button
              type="button"
              size={"lg"}
              disabled={loading}
              className="cursor-pointer"
              onClick={handlerGetCoupon}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verificando...
                </>
              ) : (
                "Aplicar cupom"
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4  ">
            <p className="text-xl">
              Total:{" "}
              <span className="font-bold">
                R${" "}
                {((Number(subtotal) * discount + deliveryPrice) / 100).toFixed(
                  2
                )}
              </span>
              {discount < 1 && (
                <span className="text-[14px]">
                  {" "}
                  (desconto de {100 - discount * 100}% aplicado)
                </span>
              )}
            </p>
          </div>

          <Button
            size={"lg"}
            type="submit"
            className="w-full cursor-pointer text-black bg-green-300 hover:bg-green-500"
          >
            Concluir compra
          </Button>
        </form>
      </Form>
    </div>
  );
};
