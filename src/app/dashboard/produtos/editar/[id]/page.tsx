import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { EditProductForm } from "./EditProductForm";
import React from "react";

interface EditProductParamsProps {
  params: Promise<{ id: string }>;
}

const EditProduct: React.FC<EditProductParamsProps> = async ({ params }) => {
  const { id } = await params; // Pegar o parâmetro enviado na URL

  const currentUser = await getCurrentUser(); // Pegar o usuário logado
  if (!currentUser) redirect("/login"); // Redirecionar usuário deslogado

  // Pegar todas as categórias
  const categories = await prisma.category.findMany({
    select: { category: true },
  });

  // Formatar as categorias em ordem alfabética
  const formatedCategories = [...categories].sort((a, b) => {
    return a.category.localeCompare(b.category);
  });

  // Pegar o produto na base de dados
  const product = await prisma.product.findUnique({ where: { id } });

  return (
    <main className="bg-slate-400 p-4 grow flex items-center justify-center">
      {product ? (
        <EditProductForm categories={formatedCategories} product={product} />
      ) : (
        <p className="font-bold text-2xl">Produto não encontrado</p>
      )}
    </main>
  );
};

export default EditProduct;
