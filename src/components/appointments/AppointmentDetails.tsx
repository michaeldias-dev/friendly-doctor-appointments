
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DetailField from "./DetailField";
import { Appointment, AppointmentTypes } from "@/types/appointment";
import { useAppointments } from "@/hooks/useAppointments";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import AppointmentFormFields from "./AppointmentFormFields";
import { useProfessionals } from "@/hooks/useProfessionals";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentTypes: AppointmentTypes;
}

const AppointmentDetails = ({ 
  appointment, 
  open, 
  onOpenChange, 
  appointmentTypes 
}: AppointmentDetailsProps) => {
  const [editMode, setEditMode] = useState(false);
  const { deleteAppointment, updateAppointment } = useAppointments();
  const { professionals } = useProfessionals();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the form with useForm
  const form = useForm({
    defaultValues: {
      patientName: "",
      date: "",
      time: "",
      type: "",
      professionalId: "",
      congregation: "",
      notes: ""
    }
  });
  
  useEffect(() => {
    if (appointment && open) {
      // Preenche o formulário com os dados da consulta atual
      form.reset({
        patientName: appointment.patient_name,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        professionalId: appointment.professional_id,
        congregation: appointment.congregation || "",
        notes: appointment.notes || "",
      });
    }
  }, [appointment, open, form]);

  if (!appointment) return null;

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta consulta?")) {
      setIsLoading(true);
      const success = await deleteAppointment(appointment.id);
      setIsLoading(false);
      if (success) {
        onOpenChange(false);
      }
    }
  };

  const handleUpdate = async (data: any) => {
    if (appointment) {
      setIsLoading(true);
      const success = await updateAppointment(appointment.id, {
        patient_name: data.patientName,
        date: data.date,
        time: data.time,
        type: data.type,
        professional_id: data.professionalId,
        congregation: data.congregation,
        notes: data.notes
      });
      setIsLoading(false);
      
      if (success) {
        setEditMode(false);
        onOpenChange(false);
      }
    }
  };

  const formattedDate = format(new Date(`${appointment.date}T${appointment.time}`), 
    "d 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });

  // Renderiza o modo de visualização
  if (!editMode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <DetailField label="Paciente" value={appointment.patient_name} />
            <DetailField label="Data/Hora" value={formattedDate} />
            <DetailField label="Profissional" value={appointment.professional_name} />
            <DetailField label="Tipo" value={appointmentTypes[appointment.type]} />
            {appointment.congregation && (
              <DetailField label="Congregação" value={appointment.congregation} />
            )}
            {appointment.notes && (
              <DetailField label="Observações" value={appointment.notes} className="whitespace-pre-wrap" />
            )}
          </div>
          
          <DialogFooter className="flex gap-2 sm:justify-between mt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditMode(true)} disabled=true>
                Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled=true
              >
                Excluir
              </Button>
            </div>
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Renderiza o modo de edição
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar Consulta</SheetTitle>
          <SheetDescription>
            Faça as alterações necessárias e salve as mudanças.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
            <AppointmentFormFields
              form={form}
              professionals={professionals}
              isLoading={isLoading}
            />
            
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppointmentDetails;
