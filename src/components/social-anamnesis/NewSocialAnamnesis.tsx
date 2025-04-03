
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AnamnesisForm from "./AnamnesisForm";

interface NewSocialAnamnesisProps {
  onSuccess?: () => void;
}

const NewSocialAnamnesis = ({ onSuccess }: NewSocialAnamnesisProps) => {
  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="flex-none">
        <SheetTitle className="text-xl">Nova Anamnese Social</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-6">
        <AnamnesisForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default NewSocialAnamnesis;
