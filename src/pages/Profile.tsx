
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialty: "",
    bio: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Usando type assertion para garantir que o tipo está correto
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: user.email || "",
          specialty: profileData.specialty || "",
          bio: profileData.bio || "", // Agora o campo bio existe na tabela
        });
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          specialty: profile.specialty,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Perfil do Médico</h1>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    value={profile.specialty}
                    onChange={(e) =>
                      setProfile({ ...profile, specialty: e.target.value })
                    }
                    readOnly={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    readOnly={!isEditing}
                    className="h-32"
                  />
                </div>

                {isEditing && (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Pacientes</p>
                  <p className="text-2xl font-bold">145</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consultas Este Mês</p>
                  <p className="text-2xl font-bold">48</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Anos de Experiência</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
