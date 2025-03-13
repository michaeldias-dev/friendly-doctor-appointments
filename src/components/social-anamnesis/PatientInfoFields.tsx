
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";

interface PatientInfoFieldsProps {
  form: UseFormReturn<SocialAnamnesisForm>;
}

const PatientInfoFields = ({ form }: PatientInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default PatientInfoFields;
