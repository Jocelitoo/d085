"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addCategoryFormSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategory, deleteCategory } from "@/actions/categoryActions";
import { useState } from "react";
import { toast } from "sonner";
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

interface Props {
  categories: {
    id: string;
    category: string;
  }[];
}

export const Client: React.FC<Props> = ({ categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const form = useForm<z.infer<typeof addCategoryFormSchema>>({
    resolver: zodResolver(addCategoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addCategoryFormSchema>) => {
    setIsLoading(true);

    createCategory(values)
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

      <h1 className="text-center text-2xl font-bold">Categorias</h1>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild className="text-end">
          <Button
            size={"lg"}
            variant={"outline"}
            className="w-fit cursor-pointer"
          >
            Criar categória
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar categória</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categória:</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Categória
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
                  <Loader2 className="animate-spin" /> Criando...
                </Button>
              ) : (
                <Button
                  type="submit"
                  size={"lg"}
                  className="w-full text-black cursor-pointer bg-green-400 hover:bg-green-600"
                >
                  Criar
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 ">
        {categories.length === 0 ? (
          <p className="text-center text-xl font-semibold">
            Nenhum categória foi encontrada
          </p>
        ) : (
          categories.map((category, index) => {
            return (
              <div
                key={index}
                className="bg-green-200 flex items-center justify-between p-4 rounded-md "
              >
                <p className="text-center text-xl">{category.category}</p>

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
                          Você tem certeza que deseja deletar essa categória ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Todos os produtos que utilizam essa categória serão
                          deletados. Portanto, essa ação não poderá ser
                          desfeita.
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
                            deleteCategory(category.id)
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
            );
          })
        )}
      </div>
    </>
  );
};
