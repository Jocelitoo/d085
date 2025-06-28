import { Header } from "@/components/home/Header";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface ProductParamsProps {
  params: Promise<{ id: string }>;
}

const Product = async ({ params }: ProductParamsProps) => {
  const { id } = await params; // Pegar o id enviado como parâmetro
  const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent); // Verificar se o usuário está acessando no desktop ou celular

  const product = await prisma.product.findUnique({ where: { id } }); // Pegar o produto

  if (!product) {
    return <p className="text-center">Produto não encontrado</p>;
  }

  // Pegar o wpp
  const phone = await prisma.phone.findFirst({ select: { number: true } });

  return (
    <>
      <Header />

      <main className="px-4 flex-grow grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-4 sm:gap-8 my-8 max-w-[1060px] mx-auto">
        <ProductImage product={product} />

        <ProductInfo product={product} />

        {phone?.number && (
          <Button
            size={"lg"}
            asChild
            className="rounded-full p-2 fixed right-2 bottom-4 z-50 size-10 lg:size-14"
          >
            <Link
              href={`https://${
                isMobile ? "api" : "web"
              }.whatsapp.com/send?phone=${phone.number}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Image
                src={"/wpp.svg"}
                width={32}
                height={32}
                alt="Icone do Whatsapp"
              />

              <span className="sr-only">Ir para o whatsapp</span>
            </Link>
          </Button>
        )}
      </main>
    </>
  );
};

export default Product;
