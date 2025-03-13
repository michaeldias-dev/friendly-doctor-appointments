
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialAnamnesisForm {
  patientName: string;
  familyComposition: string;
  housingConditions: string;
  socioeconomicStatus: string;
  supportNetwork: string;
  observations: string;
  actionPlan: string;
  nextVisit: string;
}

interface NewSocialAnamnesisProps {
  onSuccess?: () => void;
}

const NewSocialAnamnesis = ({ onSuccess }: NewSocialAnamnesisProps) => {
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
    <div className="h-full flex flex-col">
      <SheetHeader className="flex-none">
        <SheetTitle>Nova Anamnese Social</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-6">
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

            <FormField
              control={form.control}
              name="supportNetwork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rede de Apoio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a rede de apoio do paciente"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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

            <div className="flex justify-end gap-3 pt-4 pb-6">
              <Button type="submit">Salvar Anamnese</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewSocialAnamnesis;
