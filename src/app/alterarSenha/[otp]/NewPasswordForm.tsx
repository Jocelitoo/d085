"use client";

import { newPasswordFormSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { newPassword } from "@/actions/otpActions";

export const NewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { otp } = useParams<{ otp: string }>(); // Pega o OTP enviado no parâmetro

  const form = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordFormSchema>) => {
    setIsLoading(true);

    newPassword(otp, values.newPassword)
      .then((response) => {
        toast(response, {
          style: { backgroundColor: "#07bc0c", color: "#000" },
        });
        location.replace("/login"); // Redirecionar para a tela de login
      })
      .catch((error) => {
        toast(error.message, {
          style: { backgroundColor: "#e74c3c", color: "#000" },
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-4 p-4 rounded-md w-full max-w-lg"
      >
        <h1 className="font-bold text-2xl text-center">Digite a nova Senha</h1>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha:</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription className="sr-only">Nova senha</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha:</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Confirmar nova senha
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading ? (
          <Button
            size={"lg"}
            type="button"
            disabled
            className="w-full bg-green-400 text-black hover:bg-green-600 focus-visible:bg-green-600"
          >
            <LoaderCircle className="animate-spin" />
            Alterando senha...
          </Button>
        ) : (
          <Button
            size={"lg"}
            type="submit"
            className="w-full bg-green-400 text-black cursor-pointer hover:bg-green-600 focus-visible:bg-green-600"
          >
            Alterar senha
          </Button>
        )}
      </form>
    </Form>
  );
};
