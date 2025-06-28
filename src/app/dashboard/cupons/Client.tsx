"use client";

import { createCoupon, deleteCoupon } from "@/actions/couponActions";
import { Loading } from "@/components/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { addCouponFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ClientProps {
  coupons: {
    id: string;
    name: string;
    discount: number;
  }[];
}

export const Client: React.FC<ClientProps> = ({ coupons }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const form = useForm<z.infer<typeof addCouponFormSchema>>({
    resolver: zodResolver(addCouponFormSchema),
    defaultValues: {
      name: "",
      discount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof addCouponFormSchema>) => {
    setIsLoading(true);

    console.log(values);

    createCoupon(values)
      .then((response) => {
        form.reset(); // Limpa todos os campos do formulário
        setOpenDialog(false); // Fecha a tela de Dialog
        toast(response, {
          style: { backgroundColor: "#07bc0c", color: "#000" },
        });
      })
      .catch((error) => {
        toast(error.message, {
          style: { backgroundColor: "#e74c3c", color: "#000" },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {deleteLoad && <Loading text="Deletando..." />}

      <h1 className="text-center text-2xl font-bold">Cupons</h1>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild className="text-end">
          <Button
            size={"lg"}
            variant={"outline"}
            className="w-fit cursor-pointer"
          >
            Adicionar cupom
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar cupom</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do cupom:</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Nome do cupom
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (em %)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Desconto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <Button
                  disabled
                  size={"lg"}
                  className="w-full text-black bg-green-400"
                >
                  <Loader2 className="animate-spin" /> Adicionando...
                </Button>
              ) : (
                <Button
                  type="submit"
                  size={"lg"}
                  className="w-full text-black cursor-pointer bg-green-400 hover:bg-green-600"
                >
                  Adicionar
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.length === 0 ? (
          <p className="text-center text-xl font-semibold col-span-4">
            Nenhum cupom foi encontrado
          </p>
        ) : (
          coupons.map((coupon, index) => {
            return (
              <div
                key={index}
                className="bg-green-200 flex flex-col items-center gap-4 p-4 rounded-md "
              >
                <p className="text-center text-xl">
                  Cupom: <span className="font-bold">{coupon.name}</span>
                </p>
                <p className="text-center text-xl">
                  Desconto:{" "}
                  <span className="font-bold">
                    {100 - coupon.discount * 100}%
                  </span>
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size={"lg"}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash />
                      <span className="sr-only">Deletar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza que deseja deletar esse cupom ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Os usuários NÃO poderão mais usar esse cupom.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer bg-red-600"
                        onClick={() => {
                          setDeleteLoad(true);
                          deleteCoupon(coupon.id)
                            .then((response) => {
                              toast(response, {
                                style: {
                                  backgroundColor: "#07bc0c",
                                  color: "#000",
                                },
                              });
                            })
                            .catch((error) => {
                              toast(error.message, {
                                style: {
                                  backgroundColor: "#e74c3c",
                                  color: "#000",
                                },
                              });
                            })
                            .finally(() => setDeleteLoad(false));
                        }}
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
