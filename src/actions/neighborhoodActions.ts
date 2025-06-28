"use server";

import { prisma } from "@/lib/prisma";
import { addNeighborhoodFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const createNeighborhood = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addNeighborhoodFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    if (!result.data) return;

    // Verificar se o nome do bairro já está sendo utilizado na bd
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { name: result.data.name },
    });

    if (neighborhood) throw new Error("Esse bairro já está salvo");

    // Criar o item na base de dados
    await prisma.neighborhood.create({
      data: {
        name: result.data.name,
        price: result.data.price * 100,
      },
    });

    revalidatePath("/dashboard/bairros"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Dados de entrega criados com sucesso";
  } catch (error) {
    throw error;
  }
};

export const deleteNeighborhood = async (id: string) => {
  try {
    // Verificar se o item existe na bd
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id },
    });

    if (!neighborhood) throw new Error("ID inválido");

    // Deletar o item da base de dados
    await prisma.neighborhood.delete({ where: { id } });

    revalidatePath("/dashboard/bairros"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Bairro deletado com sucesso";
  } catch (error) {
    throw error;
  }
};
