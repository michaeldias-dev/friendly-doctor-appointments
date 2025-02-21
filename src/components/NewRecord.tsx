
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface NewRecordForm {
  patientName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  nextVisit: string;
}

const NewRecord = () => {
  const form = useForm<NewRecordForm>();

  const onSubmit = (data: NewRecordForm) => {
    console.log(data);
    // Aqui você implementaria a lógica para salvar o prontuário
  };

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Novo Prontuário Médico</SheetTitle>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnóstico</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o diagnóstico" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tratamento</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o tratamento prescrito" {...field} />
                </FormControl>
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
                    placeholder="Digite as observações sobre o paciente"
                    className="min-h-[120px]"
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
                <FormLabel>Próxima Visita</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit">Salvar Prontuário</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewRecord;
