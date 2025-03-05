
import React from "react";
import { XCircle } from "lucide-react";
import { UserProfile } from "@/types/user";
import UserBadge from "./UserBadge";
import DateDisplay from "./DateDisplay";

interface RejectedUserItemProps {
  user: UserProfile;
}

const RejectedUserItem = ({ user }: RejectedUserItemProps) => {
  return (
    <div 
      key={user.id} 
      className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center py-3 px-2 border-b last:border-0 rounded-md bg-red-50"
    >
      <div className="lg:col-span-2">
        <div className="flex items-center gap-1 text-red-500 text-xs mb-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Acesso rejeitado</span>
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
        {/* Sem ações para usuários rejeitados */}
      </div>
    </div>
  );
};

export default RejectedUserItem;
