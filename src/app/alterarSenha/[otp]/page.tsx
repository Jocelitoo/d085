import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { NewPasswordForm } from "./NewPasswordForm";

const NewPassword = async () => {
  const currentUser = await getCurrentUser(); // Pegar os dados do usuário logado

  if (currentUser) redirect("/"); // Redireciona o usuário logado para a home

  return (
    <main className="bg-slate-400 p-4 grow flex items-center justify-center">
      <NewPasswordForm />
    </main>
  );
};

export default NewPassword;
