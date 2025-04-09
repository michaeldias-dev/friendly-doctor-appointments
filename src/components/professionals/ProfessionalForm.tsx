
import { useState, useEffect } from 'react';
import { Professional } from '@/types/professional';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

interface ProfessionalFormProps {
  professional?: Professional;
  open: boolean;
  onSubmit: (professional: Omit<Professional, 'id'>) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const ProfessionalForm = ({ professional, open, onSubmit, onOpenChange }: ProfessionalFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (professional) {
      setFirstName(professional.first_name || '');
      setLastName(professional.last_name || '');
      setSpecialty(professional.specialty || '');
    } else {
      setFirstName('');
      setLastName('');
      setSpecialty('');
    }
  }, [professional, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        specialty: specialty.trim() || null,
      });
      
      // Reset form if needed
      setFirstName('');
      setLastName('');
      setSpecialty('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md space-y-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{professional ? 'Editar Profissional' : 'Novo Profissional'}</SheetTitle>
          <SheetDescription>
            {professional 
              ? 'Edite as informações do profissional e salve as alterações.'
              : 'Preencha as informações para adicionar um novo profissional.'}
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nome"
                className="bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Sobrenome"
                className="bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Input
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Especialidade"
                className="bg-white"
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : professional ? 'Atualizar' : 'Salvar'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProfessionalForm;
