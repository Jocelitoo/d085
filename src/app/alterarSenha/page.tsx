import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResetPasswordForm } from "./resetPasswordForm";

const ResetPassword = async () => {
  const currentUser = await getCurrentUser(); // Pegar os dados do usuário logado

  if (currentUser) redirect("/"); // Redireciona o usuário logado para a home

  const user = await prisma.user.findFirst({ select: { email: true } }); // Pega o email do único usuário registrado no sistema

  return (
    <main className="bg-slate-400 p-4 grow flex items-center justify-center">
      {user ? <ResetPasswordForm email={user.email} /> : <p>Erro</p>}
    </main>
  );
};

export default ResetPassword;
