
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { UserProfile } from "@/types/user";
import UserBadge from "./UserBadge";
import DateDisplay from "./DateDisplay";

interface PendingUserItemProps {
  user: UserProfile;
  onApprove: (userId: string, approved: boolean) => void;
}

const PendingUserItem = ({ user, onApprove }: PendingUserItemProps) => {
  return (
    <div 
      key={user.id} 
      className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center py-3 px-2 border-b last:border-0 rounded-md bg-amber-50"
    >
      <div className="lg:col-span-2">
        <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Aguardando aprovação</span>
        </div>
        <p className="font-medium">{user.first_name} {user.last_name}</p>
        <p className="text-xs text-gray-500 lg:hidden">
          {user.email}
        </p>
      </div>
      
      <div className="hidden lg:block overflow-hidden text-ellipsis">{user.email}</div>
      
      <div>{user.specialty || "-"}</div>
      
      <div>
        <UserBadge role={user.role} />
      </div>
      
      <DateDisplay date={user.created_at} />
      
      <div className="flex justify-end gap-2">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-500 hover:text-green-700 hover:bg-green-50 border-green-200"
            onClick={() => onApprove(user.id, true)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => onApprove(user.id, false)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingUserItem;
