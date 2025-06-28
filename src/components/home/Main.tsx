"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductProps } from "@/utils/props";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface MainProps {
  products: ProductProps[];
  categories: { category: string }[];
  phone: string | undefined;
}

export const Main = ({ products, categories, phone }: MainProps) => {
  const [order, setOrder] = useState("date");
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [productsPerPage, setProductsPerPage] = useState(12); // Produtos por página
  const [search, setSearch] = useState(""); // Texto digitado para pesquisar produtos
  const [selectedCategory, setSelectedCategory] = useState("todos"); // Usado para identificar qual categória foi escolhida
  const router = useRouter();
  const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent); // Verificar se o usuário está acessando no desktop ou celular

  // Controlar a ordem que os produtos vão aparecer
  const sortedProducts = useMemo(() => {
    const sorted = [...products]; // Criar uma cópia para evitar modificar o estado original

    if (order === "date") {
      // Mais recentes para os mais antigos
      sorted.sort((a, b) => {
        const aFormated = dayjs(b.createdAt).valueOf(); // Retorna a data A em milisegundos
        const bFormated = dayjs(a.createdAt).valueOf(); // Retorna a data B em milisegundos

        return aFormated - bFormated;
      });
    }

    // Maior preço para menor
    if (order === "price+") {
      sorted.sort((a, b) => {
        return b.price - a.price;
      });
    }

    // Menor preço para menor
    if (order === "price-") {
      console.log("oi");
      sorted.sort((a, b) => {
        return a.price - b.price;
      });
    }

    // Letra A-Z
    if (order === "name") {
      sorted.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    return sorted;
  }, [products, order]);

  // Filtrar produtos com base na busca
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      if (
        product.name.toUpperCase().includes(search.toUpperCase()) ||
        product.description.toUpperCase().includes(search.toUpperCase()) ||
        product.category.toUpperCase().includes(search.toUpperCase())
      ) {
        return product;
      }
    });
  }, [sortedProducts, search]);

  // Lógica para mostrar os produtos de acordo com sua página
  const formatedProducts = useMemo(() => {
    return filteredProducts.slice(
      currentPage * productsPerPage - productsPerPage,
      currentPage * productsPerPage
    );
  }, [filteredProducts, currentPage, productsPerPage]);

  // Controla a quantidade de produtos por página de acordo com o tamanho da tela
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth < 640) {
      setProductsPerPage(8);
      return;
    }

    setProductsPerPage(12);
    // if (window.innerWidth < 350) setProductsPerPage(8);
  }, []);

  useEffect(() => {
    handleWindowResize(); // Executa a função quando a página é carregada

    // Executa a função quando a página é teu seu tamanho alterado
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  // Responsável por filtrar os produtos por categória
  const handleFilter = (category: string) => {
    const query = category === "todos" ? "" : `?categoria=${category}`;
    router.push(`/${query}`);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Paginas que serão necessárias

  // Quantos vizinhos (antes/depois) da página atual você mostra
  const pageNeighbours = 1;

  // Calcula início e fim do range a renderizar
  const pagesToShow = useMemo(() => {
    const start = Math.max(1, currentPage - pageNeighbours);
    const end = Math.min(totalPages, currentPage + pageNeighbours);

    // Se estamos “no começo”, estende até obter 3 botões (se possível)
    const adjustedStart = Math.max(1, Math.min(start, end - 2));

    // Se estamos “no fim”, estende início para ter 3 botões
    const adjustedEnd = Math.min(totalPages, Math.max(end, adjustedStart + 2));

    const length = adjustedEnd - adjustedStart + 1;
    return Array.from({ length }, (_, i) => adjustedStart + i);
  }, [currentPage, totalPages]);

  return (
    <main className="grow space-y-8 px-4 sm:px-8 lg:px-20">
      <ScrollArea type="always" className="whitespace-nowrap">
        <div className="flex justify-center w-full space-x-4 p-4 ">
          <Button
            variant={"ghost"}
            size={"sm"}
            className={`text-sm cursor-pointer ${
              selectedCategory === "todos" && "bg-green-300"
            } hover:bg-green-300`}
            onClick={() => {
              handleFilter("todos");
              setSelectedCategory("todos");
              setCurrentPage(1);
            }}
          >
            Todos
          </Button>

          {categories.map((category, index) => (
            <Button
              variant={"ghost"}
              size={"sm"}
              key={index}
              className={`text-sm cursor-pointer ${
                selectedCategory === category.category && "bg-green-300"
              } hover:bg-green-300`}
              onClick={() => {
                handleFilter(category.category);
                setSelectedCategory(category.category);
                setCurrentPage(1);
              }}
            >
              {category.category}
            </Button>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex gap-4 justify-between">
        <Input
          placeholder="Pesquisar"
          type="text"
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          className="max-w-80"
        />

        <Select defaultValue={order} onValueChange={(event) => setOrder(event)}>
          <SelectTrigger className="w-36 cursor-pointer">
            <SelectValue placeholder="Ordenar por:" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="date">Mais recente</SelectItem>
              <SelectItem value="price-">Menor preço</SelectItem>
              <SelectItem value="price+">Maior preço</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {formatedProducts.length === 0 ? (
        <p className="text-center">Nenhum produto encontrado</p>
      ) : (
        <>
          <ProductCard products={formatedProducts} />

          <div className="flex justify-center gap-4 my-4">
            <Button
              variant="outline"
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((previousValue) => previousValue - 1);
                window.scrollTo(0, 0); // Rola a página para o topo
              }}
            >
              <span className="sr-only">Voltar</span>
              <ChevronLeft />
            </Button>

            <div className="flex justify-center gap-2">
              {pagesToShow.map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo(0, 0);
                  }}
                  className={`${currentPage === page && "bg-slate-100"}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
              onClick={() => {
                setCurrentPage((previousValue) => previousValue + 1);
                window.scrollTo(0, 0); // Rola a página para o topo
              }}
            >
              <span className="sr-only">Avançar</span>
              <ChevronRight />
            </Button>
          </div>
        </>
      )}

      {phone && (
        <Button
          size={"lg"}
          asChild
          className="rounded-full p-2 fixed right-2 bottom-4 z-50 size-10 lg:size-14"
        >
          <Link
            href={`https://${
              isMobile ? "api" : "web"
            }.whatsapp.com/send?phone=${phone}`}
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
  );
};
