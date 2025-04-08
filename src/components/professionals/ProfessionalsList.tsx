
import { useEffect } from 'react';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { Professional } from '@/types/professional';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfessionalsListProps {
  onEdit: (professional: Professional) => void;
  searchTerm?: string;
}

const ProfessionalsList = ({ onEdit, searchTerm = '' }: ProfessionalsListProps) => {
  const { professionals, loading, refresh } = useProfessionals();
  const { toast } = useToast();
  
  // Setup realtime updates
  useRealtimeUpdates('professionals', refresh);

  // Filter professionals based on search term
  const filteredProfessionals = professionals.filter(prof => {
    const fullName = `${prof.first_name} ${prof.last_name}`.toLowerCase();
    const specialty = prof.specialty?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || specialty.includes(search);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="bg-background border rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum profissional cadastrado</h3>
        <p className="text-muted-foreground mb-4">
          Cadastre o primeiro profissional usando o formulário acima.
        </p>
      </div>
    );
  }

  if (filteredProfessionals.length === 0) {
    return (
      <div className="bg-background border rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
        <p className="text-muted-foreground">
          Não foram encontrados profissionais correspondentes à sua pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProfessionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell className="font-medium">
                {professional.first_name} {professional.last_name}
              </TableCell>
              <TableCell>{professional.specialty || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(professional)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfessionalsList;
