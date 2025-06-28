"use server";

import { prisma } from "@/lib/prisma";
import { addCouponFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const getCoupon = async (couponName: string) => {
  try {
    // Verificar se o cupom existe na bd
    const coupon = await prisma.coupon.findUnique({
      where: { name: couponName },
    });

    if (!coupon) throw new Error("Cupom inválido");

    // revalidatePath("/dashboard/cupons"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return coupon.discount;
  } catch (error) {
    throw error;
  }
};

export const createCoupon = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addCouponFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    if (!result.data) return;

    // Formatar o nome do cupom deixando ele maiúsculo
    const formatedName = result.data.name.toUpperCase();

    // Verificar se o nome do cupom já está sendo utilizado na bd
    const coupon = await prisma.coupon.findUnique({
      where: { name: formatedName },
    });

    if (coupon) throw new Error("Já existe um cupom com esse nome");

    // Formatar o desconto do cupom para o padrão decimal (10% = 0,9)
    const formatedDiscount = 1 - result.data.discount / 100;

    // Criar o item na base de dados
    await prisma.coupon.create({
      data: {
        name: formatedName,
        discount: formatedDiscount,
      },
    });

    revalidatePath("/dashboard/cupons"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Cupom criado com sucesso";
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    // Verificar se o item existe na bd
    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) throw new Error("ID inválido");

    // Deletar o cupom da base de dados
    await prisma.coupon.delete({ where: { id } });

    revalidatePath("/dashboard/cupons"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return "Cupom deletado com sucesso";
  } catch (error) {
    throw error;
  }
};
