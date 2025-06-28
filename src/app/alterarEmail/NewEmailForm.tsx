"use client";

import { newEmailFormSchema } from "@/lib/schema";
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
import { newEmail } from "@/actions/otpActions";

export const NewEmailForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newEmailFormSchema>>({
    resolver: zodResolver(newEmailFormSchema),
    defaultValues: {
      newEmail: "",
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof newEmailFormSchema>) => {
    setIsLoading(true);

    newEmail(values)
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
        <h1 className="font-bold text-2xl text-center">Alterar email</h1>

        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription className="sr-only">Email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código:</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription className="sr-only">Código</FormDescription>
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
            Carregando...
          </Button>
        ) : (
          <Button
            size={"lg"}
            type="submit"
            className="w-full bg-green-400 text-black cursor-pointer hover:bg-green-600 focus-visible:bg-green-600"
          >
            Alterar email
          </Button>
        )}
      </form>
    </Form>
  );
};
