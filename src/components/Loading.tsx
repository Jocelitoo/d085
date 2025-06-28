import { Loader2 } from "lucide-react";

export const Loading = ({ text }: { text: string }) => {
  return (
    <div className="bg-black/90 text-white absolute top-0 left-0 h-screen w-screen flex items-center justify-center gap-2 z-50">
      <Loader2 size={30} className="animate-spin " />
      <p className="text-3xl font-semibold">{text}</p>
    </div>
  );
};
