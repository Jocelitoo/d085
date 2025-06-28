import { prisma } from "@/lib/prisma";
import { AddProductForm } from "./AddProductForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

const AddProduct = async () => {
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

  return (
    <main className="bg-slate-400 p-4 grow flex items-center justify-center">
      <AddProductForm categories={formatedCategories} />
    </main>
  );
};

export default AddProduct;
