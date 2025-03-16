
import { Card } from "@/components/ui/card";
import StatCard from "./StatCard";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface AppointmentStatsProps {
  appointmentsThisMonth: number;
  upcomingAppointments: number;
  pastAppointments: number;
  isLoading: boolean;
}

const AppointmentStats = ({
  appointmentsThisMonth,
  upcomingAppointments,
  pastAppointments,
  isLoading
}: AppointmentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Consultas este mês"
        value={appointmentsThisMonth}
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Consultas a realizar"
        value={upcomingAppointments}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Consultas realizadas"
        value={pastAppointments}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AppointmentStats;
