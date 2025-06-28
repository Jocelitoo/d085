"use server";

import { prisma } from "@/lib/prisma";
import { newEmailFormSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export const newPassword = async (otp: string, newPassword: string) => {
  try {
    // Pegar na base de dados o OTP relacionado à mudança de senha
    const hashedOTP = await prisma.otp.findUnique({
      where: { for: "Password" },
    });

    if (!hashedOTP)
      throw new Error("Nenhum código OTP de mudança de senha encontrado");

    // Verificar se o código otp expirou
    const timestamp = Date.now(); // Hora atual em MS
    const expiringOtpDate = dayjs(hashedOTP.expiresAt).valueOf(); // Hora que o código otp vai expirar no formato de MS

    if (timestamp > expiringOtpDate) throw new Error("Código OTP expirado");

    // Verificar se o otp relacionado na base de dados é o mesmo enviado
    const isOtpCorret = await bcrypt.compare(otp, hashedOTP.otp);

    if (!isOtpCorret) throw new Error("Código OTP inválido");

    // Fazer o hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Pegar o único usuário do sistema
    const user = await prisma.user.findFirst();

    if (!user) throw new Error("Nenhum usuário encontrado");

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });

    // Remover o otp da base de dados
    await prisma.otp.delete({ where: { id: hashedOTP.id } });

    return "Senha atualizada com sucesso";
  } catch (error) {
    throw error;
  }
};

export const newEmail = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = newEmailFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    if (!result.data) return;

    const { otp, newEmail } = result.data;

    // Pegar o otp da base de dados relacionado à mudança de email
    const hashedOTP = await prisma.otp.findFirst({ where: { for: "Email" } });

    if (!hashedOTP)
      throw new Error("Nenhum código OTP de mudança de email encontrado");

    // Verificar se o otp relacionado na base de dados é o mesmo enviado
    const isOtpCorret = await bcrypt.compare(otp, hashedOTP.otp);

    if (!isOtpCorret) throw new Error("Código OTP inválido");

    // Pegar o único usuário do sistema
    const user = await prisma.user.findFirst();

    if (!user) throw new Error("Nenhum usuário encontrado");

    // Atualizar email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
      },
    });

    return "Email alterado com sucesso";
  } catch (error) {
    throw error;
  }
};
