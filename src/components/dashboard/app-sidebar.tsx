"use client";

import * as React from "react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChartColumn,
  MapPin,
  Package,
  Phone,
  Tag,
  TicketPercent,
} from "lucide-react";
import { CurrentUserProps } from "@/utils/props";

const data = {
  navMain: [
    {
      title: "Início",
      url: "/dashboard",
      icon: <ChartColumn />,
    },
    {
      title: "Gerenciar produtos",
      url: "/dashboard/produtos",
      icon: <Package />,
    },
    {
      title: "Gerenciar telefone",
      url: "/dashboard/telefone",
      icon: <Phone />,
    },
    {
      title: "Gerenciar cupons",
      url: "/dashboard/cupons",
      icon: <TicketPercent />,
    },
    {
      title: "Gerenciar categórias",
      url: "/dashboard/categorias",
      icon: <Tag />,
    },
    {
      title: "Gerenciar bairros",
      url: "/dashboard/bairros",
      icon: <MapPin />,
    },
  ],
};

interface AppSidebarProps {
  currentUser: CurrentUserProps;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentUser }) => {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <span className="text-base font-semibold">
                  D085 Suplementos
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser currentUser={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
};
