import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "./CheckoutForm";
import { Header } from "@/components/home/Header";

const Checkout = async () => {
  // Pegar todas os bairros
  const neighborhoods = await prisma.neighborhood.findMany();

  // Pegar o número do wpp
  const wpp = await prisma.phone.findFirst({ select: { number: true } });

  return (
    <main>
      <Header />

      {neighborhoods && wpp ? (
        <CheckoutForm neighborhoods={neighborhoods} wpp={wpp} />
      ) : (
        <p className="my-4 text-center text-2xl font-bold">Error</p>
      )}
    </main>
  );
};

export default Checkout;
