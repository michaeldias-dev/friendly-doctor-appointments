
import AppLayout from "@/components/AppLayout";
import UsersList from "@/components/admin/UsersList";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { RefreshCw } from "lucide-react";

const AdminUsers = () => {
  const { users, isLoading, isAdmin, handleApprove, refreshUsers } = useAdminUsers();

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Verificando permissões...</h2>
            <p className="text-gray-500">Você deve ser administrador para acessar esta página</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Contagem de usuários pendentes para mostrar no badge
  const pendingCount = users.filter(user => !user.approved).length;

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administração de Usuários</h1>
            {pendingCount > 0 && (
              <p className="text-amber-600 text-sm mt-1">
                Você tem {pendingCount} {pendingCount === 1 ? 'usuário' : 'usuários'} pendente{pendingCount !== 1 && 's'} de aprovação
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshUsers} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Lista
          </Button>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <UsersList 
            users={users} 
            isLoading={isLoading} 
            onApprove={handleApprove} 
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
