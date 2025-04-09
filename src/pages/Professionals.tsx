
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProfessionalsList from '@/components/professionals/ProfessionalsList';
import ProfessionalForm from '@/components/professionals/ProfessionalForm';
import ProfessionalsHeader from '@/components/professionals/ProfessionalsHeader';
import { Professional } from '@/types/professional';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useToast } from '@/hooks/use-toast';

const Professionals = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const { createProfessional, updateProfessional } = useProfessionals();
  const { toast } = useToast();

  const handleNewProfessional = () => {
    setCurrentProfessional(undefined);
    setShowForm(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setCurrentProfessional(professional);
    setShowForm(true);
  };

  const handleSubmit = async (professional: Omit<Professional, 'id'>) => {
    try {
      if (currentProfessional) {
        // Update existing professional
        const result = await updateProfessional(currentProfessional.id, professional);
        
        if (result.success) {
          toast({
            title: 'Profissional atualizado',
            description: 'As informações do profissional foram atualizadas com sucesso.',
          });
        } else {
          toast({
            title: 'Erro ao atualizar profissional',
            description: 'Não foi possível atualizar as informações do profissional.',
            variant: 'destructive',
          });
        }
      } else {
        // Create new professional
        const result = await createProfessional(professional);
        
        if (result.success) {
          toast({
            title: 'Profissional cadastrado',
            description: 'O novo profissional foi cadastrado com sucesso.',
          });
        } else {
          toast({
            title: 'Erro ao cadastrar profissional',
            description: 'Não foi possível cadastrar o novo profissional.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <ProfessionalsHeader 
        onNewProfessional={handleNewProfessional}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="space-y-6">
        <ProfessionalsList 
          onEdit={handleEditProfessional}
          searchTerm={searchTerm}
        />

        <ProfessionalForm
          professional={currentProfessional}
          open={showForm}
          onSubmit={handleSubmit}
          onOpenChange={setShowForm}
        />
      </div>
    </AppLayout>
  );
};

export default Professionals;
