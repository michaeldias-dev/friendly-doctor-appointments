
import { useState, useRef, useEffect } from "react";
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
  // Using a controlled state to manage the select value
  const [value, setValue] = useState<string>(selectedProfessionalId || "all");
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Update internal state when prop changes
  useEffect(() => {
    setValue(selectedProfessionalId || "all");
  }, [selectedProfessionalId]);

  // Handle value change with debounce to prevent race conditions
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    // Small timeout to ensure DOM operations are complete
    setTimeout(() => {
      onChange(newValue);
    }, 0);
  };

  return (
    <div className="flex flex-col space-y-1.5 mb-4" ref={selectRef}>
      <Label htmlFor="professional-filter">Filtrar por Profissional</Label>
      <Select 
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger 
          id="professional-filter" 
          className="bg-white text-gray-900 border-gray-300"
        >
          <SelectValue placeholder="Selecione um profissional" />
        </SelectTrigger>
        <SelectContent 
          position="popper" 
          className="bg-white text-gray-900"
          style={{ zIndex: 100 }}
          sideOffset={4}
          align="start"
        >
          <SelectItem value="all" className="hover:bg-gray-100">
            Todos os profissionais
          </SelectItem>
          {professionals.map((professional) => (
            <SelectItem 
              key={professional.id} 
              value={professional.id} 
              className="hover:bg-gray-100"
            >
              {professional.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfessionalFilter;
