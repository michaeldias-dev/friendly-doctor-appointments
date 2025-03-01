
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface UserSectionHeaderProps {
  type: "pending" | "approved";
  count: number;
}

const UserSectionHeader = ({ type, count }: UserSectionHeaderProps) => {
  if (type === "pending") {
    return (
      <div className="py-2 px-3 bg-amber-50 rounded-md border border-amber-200 mb-2">
        <h3 className="font-medium text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Pendentes de aprovação ({count})
        </h3>
      </div>
    );
  }
  
  return (
    <div className="py-2 px-3 bg-green-50 rounded-md border border-green-200 mb-2">
      <h3 className="font-medium text-green-800 flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Usuários Aprovados ({count})
      </h3>
    </div>
  );
};

export default UserSectionHeader;
