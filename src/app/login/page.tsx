import { getCurrentUser } from "@/actions/getCurrentUser";
import { LoginForm } from "./LoginForm";
import { redirect } from "next/navigation";

const Login = async () => {
  const currentUser = await getCurrentUser(); // Pegar os dados do usuário logado

  if (currentUser) redirect("/"); // Redireciona o usuário logado para a home

  return (
    <main className="bg-slate-400 p-4 grow flex items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default Login;
