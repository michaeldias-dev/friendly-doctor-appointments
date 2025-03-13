
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NewSocialAnamnesis from "@/components/social-anamnesis/NewSocialAnamnesis";

interface PageHeaderProps {
  onAnamnesisCreated: () => void;
}

const PageHeader = ({ onAnamnesisCreated }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Anamneses Sociais</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Nova Anamnese</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-xl">
          <NewSocialAnamnesis onSuccess={onAnamnesisCreated} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PageHeader;
