
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import AppointmentFormFields from "./appointments/AppointmentFormFields";

interface NewAppointmentProps {
  onSuccess?: () => void;
}

const NewAppointment = ({ onSuccess }: NewAppointmentProps) => {
  const { form, professionals, isLoading, onSubmit } = useAppointmentForm(onSuccess);

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="flex-none">
        <SheetTitle>Nova Consulta</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto mt-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <AppointmentFormFields 
              form={form}
              professionals={professionals}
              isLoading={isLoading}
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
