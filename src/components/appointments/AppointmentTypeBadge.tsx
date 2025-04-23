
import { Badge } from "@/components/ui/badge";
import { AppointmentTypes } from "@/types/appointment";

interface AppointmentTypeBadgeProps {
  type: "routine" | "return" | "exam" | "emergency" | "therapy session";
  appointmentTypes: AppointmentTypes;
}

const AppointmentTypeBadge = ({ type, appointmentTypes }: AppointmentTypeBadgeProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "routine":
        return "bg-blue-100 text-blue-800";
      case "return":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-purple-100 text-purple-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "therapy session":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getTypeColor()} hover:${getTypeColor()}`}>
      {appointmentTypes[type]}
    </Badge>
  );
};

export default AppointmentTypeBadge;
