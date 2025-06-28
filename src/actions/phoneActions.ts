"use server";

import { prisma } from "@/lib/prisma";
import { addPhoneFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const createPhone = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addPhoneFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Verificar se já existe 1 telefone na base de dados (só é permitido 1)
    const phone = await prisma.phone.findFirst();

    if (phone) throw new Error("Só é permitido 1 telefone salvo");

    // Formatar o telefone removendo espaço, parentêses e traços
    const formatedPhone = result.data?.phone.replace(/[()\s-]/g, "");

    // Criar o item na base de dados
    if (!phone && formatedPhone) {
      await prisma.phone.create({
        data: {
          number: formatedPhone,
        },
      });
    }

    revalidatePath("/dashboard/telefone"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Telefone criado com sucesso";
  } catch (error) {
    throw error;
  }
};

export const deletePhone = async (id: string) => {
  try {
    // Verificar se o item existe na bd
    const phone = await prisma.phone.findUnique({
      where: { id },
    });

    if (!phone) throw new Error("ID inválido");

    // Deletar o telefone da base de dados
    await prisma.phone.delete({ where: { id } });

    revalidatePath("/dashboard/telefone"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Telefone deletado com sucesso";
  } catch (error) {
    throw error;
  }
};
