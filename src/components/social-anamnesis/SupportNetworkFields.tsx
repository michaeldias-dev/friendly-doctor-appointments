
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";

interface SupportNetworkFieldsProps {
  form: UseFormReturn<SocialAnamnesisForm>;
}

const SupportNetworkFields = ({ form }: SupportNetworkFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="supportNetwork"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rede de Apoio</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descreva a rede de apoio do paciente"
              className="min-h-[100px] bg-white"
              {...field} 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default SupportNetworkFields;
