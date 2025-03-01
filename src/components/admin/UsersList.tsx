
import React from "react";
import { CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import UsersListHeader from "./UsersListHeader";
import UserSectionHeader from "./UserSectionHeader";
import PendingUserItem from "./PendingUserItem";
import ApprovedUserItem from "./ApprovedUserItem";

interface UsersListProps {
  users: UserProfile[];
  isLoading: boolean;
  onApprove: (userId: string, approved: boolean) => void;
}

const UsersList = ({ users, isLoading, onApprove }: UsersListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  // Separar usuários em pendentes e aprovados para melhor visualização
  const pendingUsers = users.filter(user => user.approved !== true);
  const approvedUsers = users.filter(user => user.approved === true);

  return (
    <CardContent>
      <div className="space-y-4">
        <UsersListHeader />
        
        {/* Seção para usuários pendentes com cabeçalho destacado */}
        {pendingUsers.length > 0 && (
          <>
            <UserSectionHeader type="pending" count={pendingUsers.length} />
            
            {pendingUsers.map(user => (
              <PendingUserItem 
                key={user.id} 
                user={user} 
                onApprove={onApprove} 
              />
            ))}
          </>
        )}
        
        {/* Seção para usuários aprovados */}
        {approvedUsers.length > 0 && (
          <>
            <UserSectionHeader type="approved" count={approvedUsers.length} />
            
            {approvedUsers.map(user => (
              <ApprovedUserItem 
                key={user.id} 
                user={user} 
              />
            ))}
          </>
        )}
      </div>
    </CardContent>
  );
};

export default UsersList;
