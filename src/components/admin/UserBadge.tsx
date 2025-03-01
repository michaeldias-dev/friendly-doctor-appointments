
import React from "react";

interface UserBadgeProps {
  role: string | null;
}

const UserBadge = ({ role }: UserBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      role === 'admin' 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {role === 'admin' ? 'Admin' : 'Médico'}
    </span>
  );
};

export default UserBadge;
