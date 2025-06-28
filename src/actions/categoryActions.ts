"use server";

import { prisma } from "@/lib/prisma";
import { addCategoryFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const createCategory = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addCategoryFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Formatar a categoria deixando apenas a primeira letra maiúscula
    const formatedCategory = result.data?.category
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // Verificar se o item já está sendo utilizado na bd
    const categoryInUse = await prisma.category.findUnique({
      where: { category: formatedCategory },
    });

    if (categoryInUse) throw new Error("Já existe uma categória com esse nome");

    // Criar o item na base de dados
    if (formatedCategory) {
      await prisma.category.create({
        data: {
          category: formatedCategory,
        },
      });
    }

    revalidatePath("/dashboard/categorias"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Categória criada com sucesso";
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    // Verificar se o item existe na bd
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) throw new Error("ID inválido");

    // Pegar todos os produtos que tem essa categória
    const products = await prisma.product.findMany({
      where: { category: category.category },
    });

    // Deletar as imagens do cloudinary de todos os produtos
    products.map((product) => {
      product.images.map((image) => {
        const data = {
          imageId: image.id,
        };

        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/sign-cloudinary-params`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(data),
          }
        );
      });
    });

    // Deletar todos os produtos com a categória à ser deletada
    await prisma.product.deleteMany({ where: { category: category.category } });

    // Deletar a categória da base de dados
    await prisma.category.delete({ where: { id } });

    revalidatePath("/dashboard/categorias"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página

    return "Categória deletada com sucesso";
  } catch (error) {
    throw error;
  }
};
