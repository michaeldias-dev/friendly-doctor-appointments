
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  type: "routine" | "return" | "exam" | "emergency";
  notes: string | null;
  created_at: string;
  updated_at: string;
  doctor_id: string;
}

type AppointmentFromDB = {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  doctor_id: string;
}

const appointmentTypes = {
  routine: "Consulta de Rotina",
  return: "Retorno",
  exam: "Exames",
  emergency: "Emergência",
} as const;

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
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
        .select()
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;

      const validAppointments = (data || []).filter((apt): apt is AppointmentFromDB => {
        const validTypes = ["routine", "return", "exam", "emergency"];
        return validTypes.includes(apt.type);
      }).map((apt): Appointment => ({
        ...apt,
        type: apt.type as "routine" | "return" | "exam" | "emergency"
      }));

      setAppointments(validAppointments);
      
      // Extrair datas únicas para marcar no calendário
      const uniqueDates = Array.from(new Set(
        validAppointments.map(apt => apt.date)
      )).map(dateStr => new Date(dateStr));
      
      setAppointmentDates(uniqueDates);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    
    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          loadAppointments();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const filteredAppointments = appointments.filter(appointment => {
    if (!date) return false;
    return appointment.date === format(date, "yyyy-MM-dd");
  });
  
  // Função para destacar dias com consultas no calendário
  const isDayWithAppointments = (day: Date) => {
    return appointmentDates.some(appointmentDate => 
      isSameDay(day, appointmentDate)
    );
  };

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
                modifiers={{
                  booked: (date) => isDayWithAppointments(date)
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: 'bold',
                    backgroundColor: '#e5f6ff',
                    borderColor: '#0ea5e9',
                    color: '#0369a1'
                  }
                }}
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
                          {appointmentTypes[appointment.type]}
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
                  <p>{appointmentTypes[selectedAppointment.type]}</p>
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
