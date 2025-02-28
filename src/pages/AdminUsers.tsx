
import AppLayout from "@/components/AppLayout";
import UsersList from "@/components/admin/UsersList";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const AdminUsers = () => {
  const { users, isLoading, isAdmin, handleApprove } = useAdminUsers();

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Administração de Usuários</h1>
        
        <Card>
          <CardHeader>
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
