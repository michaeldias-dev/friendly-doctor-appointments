
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search } from 'lucide-react';

interface ProfessionalsHeaderProps {
  onNewProfessional: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProfessionalsHeader = ({ 
  onNewProfessional, 
  searchTerm, 
  onSearchChange 
}: ProfessionalsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profissionais</h1>
        <p className="text-muted-foreground">
          Gerenciar cadastro de profissionais do sistema
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profissional..."
            className="w-full pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onNewProfessional}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Profissional
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalsHeader;
