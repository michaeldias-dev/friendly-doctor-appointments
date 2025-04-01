
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
        <SelectTrigger id="professional-filter" className="bg-white">
          <SelectValue placeholder="Selecione um profissional" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os profissionais</SelectItem>
          {professionals.map((professional) => (
            <SelectItem key={professional.id} value={professional.id}>
              {professional.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfessionalFilter;
