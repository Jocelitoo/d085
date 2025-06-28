import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { Client } from "./Client";
import { prisma } from "@/lib/prisma";

const Phone = async () => {
  const currentUser = await getCurrentUser(); // Pega o usuário logado
  if (!currentUser) redirect("/login"); // Redirecionar usuário deslogado

  const phone = await prisma.phone.findFirst({
    select: { id: true, number: true },
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
              <Client phone={phone} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Phone;
