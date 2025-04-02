
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Professional } from "@/types/professional";

interface AppointmentFormFieldsProps {
  form: UseFormReturn<any>;
  professionals: Professional[];
  isLoading: boolean;
}

const AppointmentFormFields = ({ form, professionals, isLoading }: AppointmentFormFieldsProps) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="congregation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comum Congregação</FormLabel>
            <FormControl>
              <Input placeholder="Digite a congregação do paciente" {...field} />
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
    </>
  );
};

export default AppointmentFormFields;
