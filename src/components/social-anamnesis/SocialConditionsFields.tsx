
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";

interface SocialConditionsFieldsProps {
  form: UseFormReturn<SocialAnamnesisForm>;
}

const SocialConditionsFields = ({ form }: SocialConditionsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="familyComposition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Composição Familiar</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva a composição familiar do paciente"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="housingConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições de Moradia</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva as condições de moradia do paciente"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="socioeconomicStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situação Socioeconômica</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva a situação socioeconômica do paciente"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default SocialConditionsFields;
