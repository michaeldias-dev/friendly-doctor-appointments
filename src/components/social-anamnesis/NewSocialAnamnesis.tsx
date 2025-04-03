
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AnamnesisForm from "./AnamnesisForm";

interface NewSocialAnamnesisProps {
  onSuccess?: () => void;
}

const NewSocialAnamnesis = ({ onSuccess }: NewSocialAnamnesisProps) => {
  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="flex-none mb-2">
        <SheetTitle className="text-2xl">Nova Anamnese Social</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-8 px-1">
        <AnamnesisForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default NewSocialAnamnesis;
