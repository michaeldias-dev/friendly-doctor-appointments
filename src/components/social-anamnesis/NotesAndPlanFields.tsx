
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";

interface NotesAndPlanFieldsProps {
  form: UseFormReturn<SocialAnamnesisForm>;
}

const NotesAndPlanFields = ({ form }: NotesAndPlanFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Observações adicionais"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="actionPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plano de Ação</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o plano de ação proposto"
                className="min-h-[100px]"
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
            <FormLabel>Próximo Acompanhamento</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default NotesAndPlanFields;
