
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  email: string;
  approved: boolean;
  created_at: string;
  role: string | null;
}

interface UsersListProps {
  users: UserProfile[];
  isLoading: boolean;
  onApprove: (userId: string, approved: boolean) => void;
}

const UsersList = ({ users, isLoading, onApprove }: UsersListProps) => {
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <CardContent>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    );
  }

  if (users.length === 0) {
    return (
      <CardContent>
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum usuário encontrado</p>
        </div>
      </CardContent>
    );
  }

  // Separar usuários em pendentes e aprovados para melhor visualização
  const pendingUsers = users.filter(user => !user.approved);
  const approvedUsers = users.filter(user => user.approved);

  return (
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 font-medium text-sm text-gray-500 pb-2 border-b">
          <div className="lg:col-span-2">Nome</div>
          <div>Email</div>
          <div>Especialidade</div>
          <div>Tipo</div>
          <div>Cadastro</div>
          <div className="text-right">Status</div>
        </div>
        
        {/* Seção para usuários pendentes com cabeçalho destacado */}
        {pendingUsers.length > 0 && (
          <>
            <div className="py-2 px-3 bg-amber-50 rounded-md border border-amber-200 mb-2">
              <h3 className="font-medium text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Pendentes de aprovação ({pendingUsers.length})
              </h3>
            </div>
            
            {pendingUsers.map(user => (
              <div 
                key={user.id} 
                className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center py-3 px-2 border-b last:border-0 rounded-md bg-amber-50"
              >
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Aguardando aprovação</span>
                  </div>
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500 lg:hidden">
                    {user.email}
                  </p>
                </div>
                
                <div className="hidden lg:block overflow-hidden text-ellipsis">{user.email}</div>
                
                <div>{user.specialty || "-"}</div>
                
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Médico'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(user.created_at)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Registrado em {formatDate(user.created_at)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex justify-end gap-2">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-500 hover:text-green-700 hover:bg-green-50 border-green-200"
                      onClick={() => onApprove(user.id, true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => onApprove(user.id, false)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        
        {/* Seção para usuários aprovados */}
        {approvedUsers.length > 0 && (
          <>
            <div className="py-2 px-3 bg-green-50 rounded-md border border-green-200 mb-2">
              <h3 className="font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Usuários Aprovados ({approvedUsers.length})
              </h3>
            </div>
            
            {approvedUsers.map(user => (
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Médico'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(user.created_at)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Registrado em {formatDate(user.created_at)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex justify-end gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Aprovado
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </CardContent>
  );
};

export default UsersList;
