"use server";

import { prisma } from "@/lib/prisma";
import { addProductFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const createProduct = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addProductFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Verificar se o nome já está sendo utilizado
    const nameInUse = await prisma.product.findUnique({
      where: { name: result.data?.name },
    });

    if (nameInUse) throw new Error("Já existe um produto com esse nome");

    // Criar o produto na base de dados
    if (result.data) {
      await prisma.product.create({
        data: {
          name: result.data.name,
          category: result.data.category,
          description: result.data.description,
          price: result.data.price * 100,
          images: result.data.images,
          variations: result.data.variations,
        },
      });
    }

    revalidatePath("/dashboard/produtos"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Produto criado com sucesso";
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    // Verificar se o produto existe na base de dados
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("Esse produto não existe");

    // Deletar do cloudinary todas as imagens do produto
    product.images.map((image) => {
      const data = {
        imageId: image.id,
      };

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sign-cloudinary-params`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
    });

    // Deletar o produto
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/produtos"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Produto deletado com sucesso";
  } catch (error) {
    throw error;
  }
};

export const editProduct = async (formData: unknown, id: string) => {
  try {
    // Verificar se o produto existe
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error("Produto não encontrado na base de dados");
    }

    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addProductFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Verificar houve uma alteração no nome e se sim, verificar se o novo nome já está sendo utilizado
    const oldProductName = product.name;

    if (oldProductName !== result.data?.name) {
      const newNameInUse = await prisma.product.findUnique({
        where: { name: result.data?.name },
      });

      if (newNameInUse) throw new Error("Já existe um produto com esse nome");
    }

    // Editar o produto na base de dados
    if (result.data) {
      await prisma.product.update({
        where: { id },
        data: {
          name: result.data.name,
          category: result.data.category,
          description: result.data.description,
          price: result.data.price * 100,
          images: result.data.images,
          variations: result.data.variations,
        },
      });
    }

    revalidatePath("/dashboard/produtos"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Produto editado com sucesso";
  } catch (error) {
    throw error;
  }
};
