"use client";

import { resetPasswordFormSchema } from "@/lib/schema";
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
import { sendOTPResetPassword } from "@/actions/emailSender";
import Link from "next/link";

interface ResetPasswordFormProps {
  email: string;
}

export const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    if (values.email !== email) {
      toast("Email inválido", {
        style: { backgroundColor: "#e74c3c", color: "#000" },
      });
      return;
    }

    setIsLoading(true);

    sendOTPResetPassword(values.email)
      .then((response) => {
        toast(response, {
          style: { backgroundColor: "#07bc0c", color: "#000" },
        });
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
        <h1 className="font-bold text-2xl text-center">Alterar senha</h1>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled />
              </FormControl>
              <FormDescription className="sr-only">Email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link href={"alterarEmail"} className="block text-end underline">
          Alterar email
        </Link>

        {isLoading ? (
          <Button
            size={"lg"}
            type="button"
            disabled
            className="w-full bg-green-400 text-black hover:bg-green-600 focus-visible:bg-green-600"
          >
            <LoaderCircle className="animate-spin" />
            Enviando...
          </Button>
        ) : (
          <Button
            size={"lg"}
            type="submit"
            className="w-full bg-green-400 text-black cursor-pointer hover:bg-green-600 focus-visible:bg-green-600"
          >
            Enviar email
          </Button>
        )}
      </form>
    </Form>
  );
};
