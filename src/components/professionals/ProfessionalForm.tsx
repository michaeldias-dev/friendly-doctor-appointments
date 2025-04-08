
import { useState, useEffect } from 'react';
import { Professional } from '@/types/professional';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProfessionalFormProps {
  professional?: Professional;
  onSubmit: (professional: Omit<Professional, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const ProfessionalForm = ({ professional, onSubmit, onCancel }: ProfessionalFormProps) => {
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
  }, [professional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      alert('Nome e sobrenome são obrigatórios');
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        specialty: specialty.trim() || null,
      });
      
      // Reset form if creating a new professional
      if (!professional) {
        setFirstName('');
        setLastName('');
        setSpecialty('');
      }
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{professional ? 'Editar Profissional' : 'Novo Profissional'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : professional ? 'Atualizar' : 'Salvar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfessionalForm;
