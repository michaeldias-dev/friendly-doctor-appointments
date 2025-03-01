
import React from "react";
import { CheckCircle } from "lucide-react";
import { UserProfile } from "@/types/user";
import UserBadge from "./UserBadge";
import DateDisplay from "./DateDisplay";

interface ApprovedUserItemProps {
  user: UserProfile;
}

const ApprovedUserItem = ({ user }: ApprovedUserItemProps) => {
  return (
    <div 
      key={user.id} 
      className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center py-3 px-2 border-b last:border-0 rounded-md"
    >
      <div className="lg:col-span-2">
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Aprovado
        </span>
      </div>
    </div>
  );
};

export default ApprovedUserItem;
