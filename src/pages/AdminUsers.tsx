
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  email: string;
  approved: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAdmin = async () => {
    // Verificar se o usuário atual é um administrador
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return false;
    }

    // Na vida real, você teria uma tabela de roles ou uma flag específica para isso
    // Para simplificar, vamos considerar o primeiro usuário como admin
    const { data: firstUser } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const isUserAdmin = firstUser?.id === user.id;
    setIsAdmin(isUserAdmin);
    
    if (!isUserAdmin) {
      navigate("/dashboard");
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive"
      });
    }
    
    return isUserAdmin;
  };

  const loadUsers = async () => {
    try {
      // Carregar usuários
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar emails separadamente
      const userIds = profilesData.map(profile => profile.id);
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Erro ao buscar dados de autenticação:", authError);
        // Se não conseguirmos buscar emails, pelo menos mostramos os outros dados
        const formattedUsers = profilesData.map(profile => ({
          ...profile,
          email: 'Email não disponível'
        }));
        setUsers(formattedUsers);
        return;
      }

      // Mapear emails para perfis
      const userEmailMap = new Map();
      if (authData?.users) {
        authData.users.forEach(user => {
          userEmailMap.set(user.id, user.email);
        });
      }

      // Combinar dados
      const formattedUsers = profilesData.map(profile => ({
        ...profile,
        email: userEmailMap.get(profile.id) || 'Email não disponível'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isUserAdmin = await checkAdmin();
      if (isUserAdmin) {
        await loadUsers();
      }
    };
    
    init();
  }, [navigate]);

  const handleApprove = async (userId: string, approve: boolean) => {
    try {
      // Atualizar o status de aprovação do usuário
      const { error } = await supabase
        .from('profiles')
        .update({ approved: approve })
        .eq('id', userId);

      if (error) throw error;

      // Atualizar a lista de usuários
      await loadUsers();
      
      toast({
        title: approve ? "Usuário aprovado" : "Usuário rejeitado",
        description: approve 
          ? "O usuário agora pode acessar o sistema" 
          : "O acesso do usuário foi negado",
      });
      
      // No mundo real, aqui você enviaria um email notificando o usuário
      // sobre a aprovação ou rejeição
      const user = users.find(u => u.id === userId);
      if (user) {
        console.log(`Email seria enviado para ${user.email} informando que foi ${approve ? 'aprovado' : 'rejeitado'}`);
      }
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return <div>Verificando permissões...</div>;
  }

  return (
    <AppLayout>
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Administração de Usuários</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-4">Nenhum usuário encontrado</div>
            ) : (
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
                            onClick={() => handleApprove(user.id, true)}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleApprove(user.id, false)}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
