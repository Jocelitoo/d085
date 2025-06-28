import { Header } from "@/components/home/Header";
import { prisma } from "@/lib/prisma";
import { Main } from "@/components/home/Main";
import { Suspense } from "react";
import { Loading2 } from "@/components/Loading2";
import { Footer } from "@/components/home/Footer";

interface HomeProps {
  searchParams: Promise<{ categoria: string | undefined }>;
}

const HomeProducts = async ({ searchParams }: HomeProps) => {
  const { categoria } = await searchParams; // Pegar a categória enviado como parâmetro

  // Se veio category nos params, filtra; senão, pega todos os produtos
  const whereClause = categoria ? { category: categoria } : {};

  // Pegar os produtos
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  // Pegar as categórias
  const categories = await prisma.category.findMany();

  // Formatar as categorias em ordem alfabética
  const formatedCategories = [...categories].sort((a, b) => {
    return a.category.localeCompare(b.category);
  });

  // Pegar o wpp
  const phone = await prisma.phone.findFirst({ select: { number: true } });

  return (
    <Main
      products={products}
      categories={formatedCategories}
      phone={phone?.number}
    />
  );
};

const Home = ({ searchParams }: HomeProps) => {
  return (
    <>
      <Header />

      <Suspense fallback={<Loading2 loadingText="Carregando produtos..." />}>
        <HomeProducts searchParams={searchParams} />

        <Footer />
      </Suspense>
    </>
  );
};

export default Home;
