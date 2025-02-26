
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewAppointment from "@/components/NewAppointment";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  created_at: string;
}

const appointmentTypes = {
  routine: "Consulta de Rotina",
  return: "Retorno",
  exam: "Exames",
  emergency: "Emergência",
};

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [navigate]);

  const filteredAppointments = appointments.filter(appointment => {
    if (!date) return false;
    return appointment.date === format(date, "yyyy-MM-dd");
  });

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Nova Consulta</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <NewAppointment onSuccess={loadAppointments} />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Consultas para {date ? format(date, "d 'de' MMMM, yyyy", { locale: ptBR }) : "hoje"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center text-gray-500">Carregando consultas...</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center text-gray-500">
                    Nenhuma consulta agendada para esta data
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-500">
                          {appointmentTypes[appointment.type as keyof typeof appointmentTypes]}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {format(new Date(`2000-01-01T${appointment.time}`), "HH:mm")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Paciente</h3>
                  <p>{selectedAppointment.patient_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Data e Hora</h3>
                  <p>
                    {format(new Date(selectedAppointment.date), "d 'de' MMMM, yyyy", { locale: ptBR })} às{" "}
                    {format(new Date(`2000-01-01T${selectedAppointment.time}`), "HH:mm")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Tipo de Consulta</h3>
                  <p>{appointmentTypes[selectedAppointment.type as keyof typeof appointmentTypes]}</p>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <h3 className="font-medium text-gray-500">Observações</h3>
                    <p>{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Appointments;
