
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  email: string;
  approved: boolean;
  created_at: string;
}

interface UsersListProps {
  users: UserProfile[];
  isLoading: boolean;
  onApprove: (userId: string, approved: boolean) => void;
}

const UsersList = ({ users, isLoading, onApprove }: UsersListProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Carregando usuários...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-4">Nenhum usuário encontrado</div>;
  }

  return (
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 font-medium text-sm text-gray-500 pb-2 border-b">
          <div className="lg:col-span-2">Nome</div>
          <div>Email</div>
          <div>Especialidade</div>
          <div className="text-right">Ações</div>
        </div>
        
        {users.map(user => (
          <div key={user.id} className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center py-2 border-b last:border-0">
            <div className="lg:col-span-2">
              <p className="font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-gray-500 lg:hidden">{user.email}</p>
            </div>
            <div className="hidden lg:block">{user.email}</div>
            <div>{user.specialty}</div>
            <div className="flex justify-end gap-2">
              {user.approved ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Aprovado
                </span>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-green-500 hover:text-green-700 hover:bg-green-100"
                    onClick={() => onApprove(user.id, true)}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onApprove(user.id, false)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};

export default UsersList;
