import { Loader2 } from "lucide-react";

interface Loading2Props {
  loadingText: string;
}

export const Loading2: React.FC<Loading2Props> = ({ loadingText }) => {
  return (
    <div className="flex-grow flex items-center justify-center gap-2">
      <Loader2 className="animate-spin" />
      <p>{loadingText}</p>
    </div>
  );
};
