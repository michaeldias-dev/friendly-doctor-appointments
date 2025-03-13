
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";
import PatientInfoFields from "./PatientInfoFields";
import SocialConditionsFields from "./SocialConditionsFields";
import SupportNetworkFields from "./SupportNetworkFields";
import NotesAndPlanFields from "./NotesAndPlanFields";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnamnesisFormProps {
  onSuccess?: () => void;
}

const AnamnesisForm = ({ onSuccess }: AnamnesisFormProps) => {
  const form = useForm<SocialAnamnesisForm>();
  const { toast } = useToast();

  const onSubmit = async (data: SocialAnamnesisForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from("social_anamnesis")
        .insert({
          social_worker_id: user.id,
          patient_name: data.patientName,
          family_composition: data.familyComposition,
          housing_conditions: data.housingConditions,
          socioeconomic_status: data.socioeconomicStatus,
          support_network: data.supportNetwork,
          observations: data.observations,
          action_plan: data.actionPlan,
          next_visit: data.nextVisit || null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Anamnese social criada com sucesso!",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PatientInfoFields form={form} />
        <SocialConditionsFields form={form} />
        <SupportNetworkFields form={form} />
        <NotesAndPlanFields form={form} />

        <div className="flex justify-end gap-3 pt-4 pb-6">
          <Button type="submit">Salvar Anamnese</Button>
        </div>
      </form>
    </Form>
  );
};

export default AnamnesisForm;
