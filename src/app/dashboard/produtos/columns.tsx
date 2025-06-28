"use client";

import { deleteProduct } from "@/actions/productActions";
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
import { ProductProps } from "@/utils/props";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// Componente separado para a célula de ações pois é preciso usar hooks que só funcionam dentro de component React
const ActionsCell: React.FC<{
  id: string;
}> = ({ id }) => {
  return (
    <div className="flex gap-4">
      <Button variant={"outline"} asChild>
        <Link href={`produtos/editar/${id}`}>
          <SquarePen />
          <p className="sr-only">Editar produto</p>
        </Link>
      </Button>

      <Button variant={"outline"} asChild>
        <Link
          href={`/produto/${id}`}
          className="border rounded-md py-2 px-4 flex items-center"
        >
          <Eye size={16} />
          <p className="sr-only">Ver produto</p>
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer border rounded-md px-4 transition-colors duration-300 hover:bg-red-500">
          <Trash2 size={16} />
          <p className="sr-only">Deletar</p>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza ?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita. O produto sera permanentemente
              deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteProduct(id)
                  .then((response) => {
                    toast(response, {
                      style: { backgroundColor: "#07bc0c", color: "#000" },
                    });
                  })
                  .catch((error) => {
                    toast(error.message, {
                      style: { backgroundColor: "#e74c3c", color: "#000" },
                    });
                  })
              }
              className="cursor-pointer text-black bg-red-300 transition-colors duration-300 hover:bg-red-500 "
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<ProductProps>[] = [
  {
    accessorKey: "name",
    header: "Produto",
    cell: ({ row }) => {
      const url = row.original.images[0].url; // Pega a url da primeira imagem
      return (
        <div className="flex items-center gap-2 min-w-24">
          <Image src={url} alt={row.original.name} width={48} height={48} />
          <p className="line-clamp-4"> {row.original.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Preço <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      const formattedPrice = (price / 100).toFixed(2);

      return <p>R$ {formattedPrice}</p>;
    },
  },
  { accessorKey: "category", header: "Categória" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const id = row.original.id; // Id do produto
      return <ActionsCell id={id} />;
    },
  },
];
