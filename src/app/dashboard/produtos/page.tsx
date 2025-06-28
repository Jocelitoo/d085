import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const DashboardProduct = async () => {
  const currentUser = await getCurrentUser(); // Pegar o usuário logado
  if (!currentUser) redirect("/login"); // Redirecionar usuário deslogado

  // Pegar todos os produtos
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Pegar todas as categórias
  const categories = await prisma.category.findMany({
    select: { category: true },
  });

  // Formatar as categorias em ordem alfabética
  const formatedCategories = [...categories].sort((a, b) => {
    return a.category.localeCompare(b.category);
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentUser={currentUser} />

      <SidebarInset>
        <SiteHeader />

        <div className="my-8 px-2 sm:px-4 lg:px-20">
          <DataTable
            columns={columns}
            data={products}
            categories={formatedCategories}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardProduct;
