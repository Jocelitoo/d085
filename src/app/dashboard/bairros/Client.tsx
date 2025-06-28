"use client";

import {
  createNeighborhood,
  deleteNeighborhood,
} from "@/actions/neighborhoodActions";
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
import { addNeighborhoodFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ClientProps {
  neighborhoods: {
    id: string;
    name: string;
    price: number;
  }[];
}

export const Client = ({ neighborhoods }: ClientProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const form = useForm<z.infer<typeof addNeighborhoodFormSchema>>({
    resolver: zodResolver(addNeighborhoodFormSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof addNeighborhoodFormSchema>) => {
    setIsLoading(true);

    console.log(values);

    createNeighborhood(values)
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
            Adicionar bairro
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar bairro</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do bairro:</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Nome do bairro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de entrega</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Taxa de entrega
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
        {neighborhoods.length === 0 ? (
          <p className="text-center text-xl font-semibold col-span-4">
            Nenhum bairro foi encontrado
          </p>
        ) : (
          neighborhoods.map((neighborhood, index) => {
            return (
              <div
                key={index}
                className="bg-green-200 flex flex-col items-center gap-4 p-4 rounded-md "
              >
                <p className="text-center text-xl">
                  Bairro: <span className="font-bold">{neighborhood.name}</span>
                </p>
                <p className="text-center text-xl">
                  Taxa de entrega:{" "}
                  <span className="font-bold">
                    R$ {(neighborhood.price / 100).toFixed(2)}
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
                        Você tem certeza que deseja deletar esse bairro ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Os usuários NÃO poderão escolher esse bairro para
                        entrega.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer bg-red-600 hover:bg-red-800"
                        onClick={() => {
                          setDeleteLoad(true);
                          deleteNeighborhood(neighborhood.id)
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
