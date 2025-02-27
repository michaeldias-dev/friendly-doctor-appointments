
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ClipboardList, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [pendingRecords, setPendingRecords] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Data de hoje no formato do banco
      const today = format(new Date(), "yyyy-MM-dd");
      
      // Carregar consultas de hoje
      const { data: todayAppts, error: todayError } = await supabase
        .from("appointments")
        .select("*")
        .eq("date", today)
        .order("time", { ascending: true });
        
      if (todayError) throw todayError;
      setTodayAppointments(todayAppts?.length || 0);
      
      // Carregar consultas recentes
      const { data: recentAppts, error: recentError } = await supabase
        .from("appointments")
        .select("*")
        .order("date", { ascending: false })
        .order("time", { ascending: true })
        .limit(3);
        
      if (recentError) throw recentError;
      setRecentAppointments(recentAppts || []);
      
      // Carregar prontuários recentes
      const { data: recentMedRecords, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
        
      if (recordsError) throw recordsError;
      setRecentRecords(recentMedRecords || []);
      setPendingRecords(Math.min(4, recentMedRecords?.length || 0)); // Simulação de prontuários pendentes
      
      // Contar pacientes únicos (baseado nas consultas, já que não temos tabela de pacientes)
      const { data: allAppointments, error: allApptsError } = await supabase
        .from("appointments")
        .select("patient_name");
        
      if (allApptsError) throw allApptsError;
      
      // Contar pacientes únicos
      const uniquePatients = new Set(allAppointments?.map(a => a.patient_name));
      setTotalPatients(uniquePatients.size);
      
    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Configurar listeners para atualizações em tempo real
    const appointmentsChannel = supabase
      .channel('dashboard-appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();
      
    const recordsChannel = supabase
      .channel('dashboard-records-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medical_records' },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, [navigate]);

  const getAppointmentType = (type: string) => {
    const types: Record<string, string> = {
      'routine': 'Consulta de Rotina',
      'return': 'Retorno',
      'exam': 'Exames',
      'emergency': 'Emergência'
    };
    return types[type] || type;
  };

  return (
    <AppLayout>
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Consultas de Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : todayAppointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Prontuários Pendentes
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : pendingRecords}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : totalPatients}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500">Carregando...</div>
                ) : recentAppointments.length === 0 ? (
                  <div className="text-center text-gray-500">Nenhuma consulta encontrada</div>
                ) : (
                  recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-500">{getAppointmentType(appointment.type)}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(`2000-01-01T${appointment.time}`), "HH:mm")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prontuários Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500">Carregando...</div>
                ) : recentRecords.length === 0 ? (
                  <div className="text-center text-gray-500">Nenhum prontuário encontrado</div>
                ) : (
                  recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{record.patient_name}</p>
                        <p className="text-sm text-gray-500">{record.diagnosis}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(record.created_at), "dd/MM/yy")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
