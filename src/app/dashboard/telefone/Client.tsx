"use client";

import { createPhone, deletePhone } from "@/actions/phoneActions";
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
import { addPhoneFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ClientProps {
  phone: {
    id: string;
    number: string;
  } | null;
}

export const Client: React.FC<ClientProps> = ({ phone }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const form = useForm<z.infer<typeof addPhoneFormSchema>>({
    resolver: zodResolver(addPhoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addPhoneFormSchema>) => {
    setIsLoading(true);

    createPhone(values)
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

      <h1 className="text-center text-2xl font-bold">Telefone</h1>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild className="text-end">
          <Button
            size={"lg"}
            variant={"outline"}
            className="w-fit cursor-pointer"
          >
            Adicionar telefone
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar telefone</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone:</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        placeholder="55 (85) 91234-5678"
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Telefone
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

      <div className="flex flex-col gap-4 ">
        {!phone ? (
          <p className="text-center text-xl font-semibold">
            Nenhum telefone foi encontrado
          </p>
        ) : (
          <div className="bg-green-200 flex items-center justify-between p-4 rounded-md ">
            <p className="text-center text-xl">{phone.number}</p>

            <div className="space-x-4">
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
                      Você tem certeza que deseja deletar esse telefone ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Os usuários NÃO terão como ser redirecionados para o
                      whatsapp. Portanto, essa ação não poderá ser desfeita.
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
                        deletePhone(phone.id)
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
          </div>
        )}
      </div>
    </>
  );
};
