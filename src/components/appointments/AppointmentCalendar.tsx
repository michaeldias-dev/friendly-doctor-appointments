
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface AppointmentCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  isDayWithAppointments: (date: Date) => boolean;
}

const AppointmentCalendar = ({
  date,
  onDateSelect,
  isDayWithAppointments
}: AppointmentCalendarProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-md border pointer-events-auto mx-auto scale-110 transform-gpu pb-4"
          locale={ptBR}
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
  );
};

export default AppointmentCalendar;
