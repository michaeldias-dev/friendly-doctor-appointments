
import React from "react";
import { Clock } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { formatDate } from "@/utils/date-formatter";

interface DateDisplayProps {
  date: string;
}

const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <div className="text-xs text-gray-500">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(date)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Registrado em {formatDate(date)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DateDisplay;
