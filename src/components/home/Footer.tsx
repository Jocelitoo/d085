"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer className="bg-slate-200 flex flex-col gap-8 items-center p-4 sm:p-8 lg:px-20">
      <Link href={"/"}>D085 Suplementos</Link>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant={"outline"} size={"lg"} asChild>
          <Link
            href={
              "https://www.instagram.com/d085suplementos?igsh=Zmo1M2FvNWwxdmth"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </Link>
        </Button>

        <Button variant={"outline"} size={"lg"} asChild>
          <Link
            href={"https://maps.app.goo.gl/3D8DiYEzbhFzB1MH7"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Localização
          </Link>
        </Button>
      </div>
    </footer>
  );
};
