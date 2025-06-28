import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;

// Escolher rotas em que o middleware sera executado
export const config = {
  matcher: ["/dashboard/:path*"],
};

export const middleware = async (request: NextRequest) => {
  // Pegar o token (name, email, ...) do usuário logado, null se estiver deslogado
  const token = await getToken({ req: request, secret });

  // Código executado se usuário estiver deslogado
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se usuário estiver logado, segue o fluxo normal
  return NextResponse.next();
};
