
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string | null;
}

interface NewAppointmentForm {
  patientName: string;
  date: string;
  time: string;
  type: "routine" | "return" | "exam" | "emergency";
  professionalId: string;
  notes?: string;
}

interface NewAppointmentProps {
  onSuccess?: () => void;
}

const NewAppointment = ({ onSuccess }: NewAppointmentProps) => {
  const form = useForm<NewAppointmentForm>();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, specialty")
          .eq("approved", true)
          .order("first_name", { ascending: true });

        if (error) throw error;
        setProfessionals(data || []);
      } catch (error: any) {
        console.error("Erro ao carregar profissionais:", error.message);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de profissionais.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [toast]);

  const onSubmit = async (data: NewAppointmentForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from("appointments")
        .insert([{
          professional_id: data.professionalId,
          patient_name: data.patientName,
          date: data.date,
          time: data.time,
          type: data.type,
          notes: data.notes || null,
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Consulta agendada com sucesso!",
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="flex-none">
        <SheetTitle>Nova Consulta</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Carregando profissionais...</SelectItem>
                      ) : professionals.length === 0 ? (
                        <SelectItem value="empty" disabled>Nenhum profissional disponível</SelectItem>
                      ) : (
                        professionals.map((professional) => (
                          <SelectItem key={professional.id} value={professional.id}>
                            {professional.first_name} {professional.last_name}
                            {professional.specialty && ` (${professional.specialty})`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Paciente</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do paciente" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Consulta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de consulta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="routine">Consulta de Rotina</SelectItem>
                      <SelectItem value="return">Retorno</SelectItem>
                      <SelectItem value="exam">Exames</SelectItem>
                      <SelectItem value="emergency">Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite observações sobre a consulta"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 pb-6">
              <Button type="submit">Agendar Consulta</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewAppointment;
