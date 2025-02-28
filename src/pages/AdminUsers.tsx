
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

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administração de Usuários</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshUsers} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
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
