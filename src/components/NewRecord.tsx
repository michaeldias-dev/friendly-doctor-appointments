
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewRecordForm {
  patientName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  nextVisit: string;
}

interface NewRecordProps {
  onSuccess?: () => void;
}

const NewRecord = ({ onSuccess }: NewRecordProps) => {
  const form = useForm<NewRecordForm>();
  const { toast } = useToast();

  const onSubmit = async (data: NewRecordForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from("medical_records")
        .insert({
          doctor_id: user.id,
          patient_name: data.patientName,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          next_visit: data.nextVisit || null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Prontuário criado com sucesso!",
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
        <SheetTitle className="text-xl">Novo Prontuário Médico</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-6 px-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nome do Paciente</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome do paciente" 
                      {...field} 
                      className="h-11 bg-white" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Diagnóstico</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o diagnóstico" 
                      {...field} 
                      className="h-11 bg-white" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Tratamento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o tratamento prescrito" 
                      {...field} 
                      className="h-11 bg-white" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite as observações sobre o paciente"
                      className="min-h-[140px] bg-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Próxima Visita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-11 bg-white" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 pb-8">
              <Button type="submit" size="lg" className="px-8">Salvar Prontuário</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewRecord;
