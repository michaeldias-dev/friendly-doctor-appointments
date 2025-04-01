
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfessionalFilterProps {
  professionals: { id: string; name: string }[];
  selectedProfessionalId: string | null;
  onChange: (id: string) => void;
}

const ProfessionalFilter = ({ 
  professionals, 
  selectedProfessionalId, 
  onChange 
}: ProfessionalFilterProps) => {
  return (
    <div className="flex flex-col space-y-1.5 mb-4">
      <Label htmlFor="professional-filter">Filtrar por Profissional</Label>
      <Select 
        value={selectedProfessionalId || "all"} 
        onValueChange={onChange}
      >
        <SelectTrigger id="professional-filter" className="bg-white text-gray-900 border-gray-300">
          <SelectValue placeholder="Selecione um profissional" />
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900">
          <SelectItem value="all" className="hover:bg-gray-100">Todos os profissionais</SelectItem>
          {professionals.map((professional) => (
            <SelectItem key={professional.id} value={professional.id} className="hover:bg-gray-100">
              {professional.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfessionalFilter;
