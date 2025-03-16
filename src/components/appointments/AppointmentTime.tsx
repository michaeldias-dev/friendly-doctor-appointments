
import { format } from "date-fns";

interface AppointmentTimeProps {
  time: string;
}

const AppointmentTime = ({ time }: AppointmentTimeProps) => {
  return (
    <span className="text-sm text-gray-500">
      {format(new Date(`2000-01-01T${time}`), "HH:mm")}
    </span>
  );
};

export default AppointmentTime;
