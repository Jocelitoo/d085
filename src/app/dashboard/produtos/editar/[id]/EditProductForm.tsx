"use client";

import { editProduct } from "@/actions/productActions";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { addProductFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Camera, Loader2Icon, Trash } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { ProductProps } from "@/utils/props";

interface AddProductFormProps {
  categories: {
    category: string;
  }[];
  product: ProductProps;
}

export const EditProductForm: React.FC<AddProductFormProps> = ({
  categories,
  product,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasVariation, setHasVariation] = useState(false);
  const [variation, setVariation] = useState("");

  useEffect(() => {
    if (product.variations.length > 0) setHasVariation(true);
  }, [product]);

  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: product?.name,
      category: product?.category,
      description: product?.description,
      variations: product?.variations,
      images: product?.images,
      price: (product?.price || 0) / 100,
    },
  });

  // "Assistir" o array variations
  const variations = form.watch("variations") || [];

  // Manipular o campo 'images' que é um array
  const imageFields = useFieldArray({
    control: form.control,
    name: "images",
  });

  const onSubmit = (values: z.infer<typeof addProductFormSchema>) => {
    setIsLoading(true);

    editProduct(values, product.id)
      .then((response) => {
        toast(response, {
          style: { backgroundColor: "#07bc0c", color: "#000" },
        });
        location.assign("/dashboard/produtos"); // Navegar para o link especificado
      })
      .catch((error) => {
        toast(error.message, {
          style: { backgroundColor: "#e74c3c", color: "#000" },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const deleteImageInCloudinary = (index: number) => {
    const id = form.getValues(`images.${index}.id`); // Pega o id do campo do formulário que teve o index especificado
    imageFields.remove(index); // Remove o array que teve o index especificado

    if (id) {
      const data = {
        imageId: id,
      };

      fetch(`/api/sign-cloudinary-params`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
    }
  };

  if (!product) {
    return <p className="text-2xl font-semibold">Produto não encontrado</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-4 border p-4 rounded-md w-full max-w-lg"
      >
        <h1 className="font-bold text-2xl text-center">Editar produto</h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome:</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription className="sr-only">Nome</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição:</FormLabel>
              <FormControl>
                <Textarea {...field} rows={30} />
              </FormControl>
              <FormDescription className="sr-only">Descrição</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categória:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="cursor-pointer">
                  <SelectTrigger className="border p-2 rounded-md text-start">
                    <SelectValue placeholder="Selecione uma categória" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category, index) => {
                    return (
                      <SelectItem key={index} value={category.category}>
                        {category.category}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription className="sr-only">Categória</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor:</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormDescription className="sr-only">Valor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <p className="font-semibold text-sm">Imagens:</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {imageFields.fields.map((field, index) => {
              return (
                <div key={index}>
                  <FormField
                    control={form.control}
                    name={`images`}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <CldUploadWidget
                            signatureEndpoint="/api/sign-cloudinary-params"
                            onSuccess={(result) => {
                              // Verifica se result.info é um objeto com a propriedade secure_url (corrige erro do TS não reconhece secure_url e secure_id)
                              if (
                                typeof result.info === "object" &&
                                result.info?.secure_url &&
                                result.info?.public_id
                              ) {
                                const imageUrl = result.info.secure_url;
                                const imageId = result.info.public_id;

                                form.setValue(`images.${index}.url`, imageUrl);
                                form.setValue(`images.${index}.id`, imageId);
                              } else {
                                console.error(
                                  "Erro: O resultado retornado não contém os dados esperados."
                                );
                              }
                            }}
                            options={{
                              maxFiles: 1, // Só 1 imagem pode ser enviada por vez
                              sources: ["local", "google_drive"], // Somente imagens locais (no computador) e imagens do google drive podem ser enviadas
                              clientAllowedFormats: [
                                "jpg",
                                "jpeg",
                                "webp",
                                "png",
                              ], // Formatos aceitáveis
                              maxImageFileSize: 5000000, // 5MB é o tamanho máximo da imagem
                              autoMinimize: true, // Minimiza a tela de enviar imagens quando uma imagem sofrer upload, assim evita o usuário enviar múltiplas imagens
                            }}
                          >
                            {({ open }) => {
                              const url = form.getValues(`images.${index}.url`); // Pega a url da imagem

                              return (
                                <>
                                  {url ? (
                                    <div className="border-dashed border-2 border-slate-300 rounded-md h-20 overflow-hidden relative w-full">
                                      <Image
                                        src={url}
                                        alt="teste"
                                        fill
                                        className="w-full h-full object-fill"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <Button
                                        variant={"ghost"}
                                        size={"lg"}
                                        type="button"
                                        onClick={() => open()}
                                        className="border-dashed border-2 border-slate-300 w-full h-20 cursor-pointer"
                                      >
                                        <Camera />
                                      </Button>
                                    </>
                                  )}
                                </>
                              );
                            }}
                          </CldUploadWidget>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant={"outline"}
                    size={"lg"}
                    type="button"
                    onClick={() => deleteImageInCloudinary(index)}
                    className="cursor-pointer w-full mt-2 transition-colors duration-300 hover:bg-red-500"
                  >
                    Deletar
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            size={"lg"}
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => imageFields.append({ id: "", url: "" })}
          >
            Adicionar imagem
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="font-semibold text-sm">Variações: (opcional) </p>

          {!hasVariation && (
            <Button
              variant={"outline"}
              size={"lg"}
              type="button"
              className="cursor-pointer"
              onClick={() => setHasVariation(true)}
            >
              Adicionar variação
            </Button>
          )}

          {hasVariation && (
            <>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={variation}
                  placeholder="Digite a nova variação"
                  onChange={(event) => setVariation(event.target.value)}
                />

                <div className="space-x-4">
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      form.setValue("variations", [...variations, variation]); // Adicionar a nova variação no array
                      setVariation(""); // Limpar o input de variation
                    }}
                  >
                    Adicionar
                  </Button>

                  <Button
                    type="button"
                    size={"lg"}
                    className="cursor-pointer"
                    onClick={() => {
                      setHasVariation(false);
                      form.setValue("variations", []); // Limpar o array variation
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>

              {variations.map((variation, index) => {
                return (
                  <div
                    key={index}
                    className="bg-green-200 p-2 rounded-md flex items-center justify-between"
                  >
                    <p>{variation}</p>

                    <Button
                      type="button"
                      size={"lg"}
                      variant={"destructive"}
                      className="cursor-pointer"
                      onClick={() => {
                        form.setValue(
                          "variations",
                          variations.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <span className="sr-only">Deletar variação</span>
                      <Trash />
                    </Button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {isLoading ? (
          <Button
            size={"lg"}
            disabled
            className="w-full bg-green-400 text-black"
          >
            <Loader2Icon className="animate-spin" /> Editando...
          </Button>
        ) : (
          <Button
            size={"lg"}
            type="submit"
            className="w-full text-black cursor-pointer bg-green-400 hover:bg-green-600"
          >
            Editar
          </Button>
        )}
      </form>
    </Form>
  );
};
