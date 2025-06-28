import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "No mínimo 8 caracteres"),
});

export const addCategoryFormSchema = z.object({
  category: z.string().min(1, "Campo obrigatório"),
});

export const addProductFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  description: z.string().min(1, "Campo obrigatório"),
  category: z.string().min(1, "Campo obrigatório"),
  price: z.coerce.number().min(1, "Campo obrigatório"),
  images: z
    .array(
      z.object({
        url: z.string().min(1, "É preciso escolher no mínimo 1 imagem"),
        id: z.string().min(1, "É preciso escolher no mínimo 1 imagem"),
      })
    )
    .min(1, "Escolha no mínimo 1 imagem"),
  variations: z.array(z.string()).optional(),
});

export const addPhoneFormSchema = z.object({
  phone: z.string().min(11, "Campo obrigatório"),
});

export const addCouponFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  discount: z.coerce.number().min(0.1, "Campo obrigatório"),
});

export const addNeighborhoodFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  price: z.coerce.number().min(1, "Campo obrigatório"),
});

export const checkoutFormSchema = z
  .object({
    name: z.string().min(2, "Campo obrigatório").max(50),
    phone: z.string().min(2, "Campo obrigatório").max(50),
    deliver: z.enum(["Retirar na loja", "Entrega"], {
      errorMap: () => ({ message: "Escolha um formato de entrega" }),
    }),
    paymentMethod: z.enum(["Dinheiro", "Pix", "Débito", "Crédito"], {
      errorMap: () => ({ message: "Escolha uma forma de pagamento" }),
    }),
    neighborhood: z.string(),
    address: z.string().max(50),
  })
  .superRefine((data, ctx) => {
    // Se o usuário escolheu "entrega", tornar neighborhood e address obrigatórios
    if (data.deliver === "Entrega") {
      if (!data.neighborhood || data.neighborhood.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["neighborhood"],
          message: "Bairro é obrigatório para entrega",
        });
      }

      if (!data.address || data.address.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Endereço é obrigatório para entrega",
        });
      }
    }
  });

export const resetPasswordFormSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const newPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Senha precisa ter no MÍNIMO 8 digitos" })
      .max(20, { message: "Senha só pode ter no MÁXIMO 20 digitos" }),
    confirmNewPassword: z
      .string()
      .min(8, { message: "Confirmar senha precisa ter no MÍNIMO 8 digitos" })
      .max(20, { message: "Confirmar senha só pode ter no MÁXIMO 20 digitos" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"], // Indica onde o erro será mostrado
  });

export const newEmailFormSchema = z.object({
  newEmail: z.string().email("Email inválido"),
  otp: z.string().min(1, "Campo obrigatório"),
});
