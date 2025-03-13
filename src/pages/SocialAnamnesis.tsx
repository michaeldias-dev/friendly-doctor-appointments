
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NewSocialAnamnesis from "@/components/NewSocialAnamnesis";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

interface SocialAnamnesis {
  id: string;
  patient_name: string;
  family_composition: string;
  housing_conditions: string;
  socioeconomic_status: string;
  support_network: string;
  observations: string;
  action_plan: string;
  next_visit: string | null;
  created_at: string;
}

const SocialAnamnesis = () => {
  const [anamneses, setAnamneses] = useState<SocialAnamnesis[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadAnamneses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("social_anamnesis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAnamneses(data || []);
    } catch (error) {
      console.error("Erro ao carregar anamneses sociais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnamneses();
  }, [navigate]);

  const downloadPDF = (anamnesis: SocialAnamnesis) => {
    const pdf = new jsPDF();
    const lineHeight = 10;
    let yPosition = 20;

    // Título
    pdf.setFontSize(20);
    pdf.text("Anamnese Social", 20, yPosition);
    yPosition += lineHeight * 2;

    // Informações do paciente
    pdf.setFontSize(12);
    pdf.text(`Paciente: ${anamnesis.patient_name}`, 20, yPosition);
    yPosition += lineHeight;
    
    pdf.text(`Data: ${format(new Date(anamnesis.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}`, 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Composição Familiar
    pdf.setFontSize(14);
    pdf.text("Composição Familiar:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(anamnesis.family_composition || "Não informado", 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Condições de Moradia
    pdf.setFontSize(14);
    pdf.text("Condições de Moradia:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(anamnesis.housing_conditions || "Não informado", 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Situação Socioeconômica
    pdf.setFontSize(14);
    pdf.text("Situação Socioeconômica:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(anamnesis.socioeconomic_status || "Não informado", 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Rede de Apoio
    pdf.setFontSize(14);
    pdf.text("Rede de Apoio:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(anamnesis.support_network || "Não informado", 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Observações
    if (anamnesis.observations) {
      pdf.setFontSize(14);
      pdf.text("Observações:", 20, yPosition);
      yPosition += lineHeight;
      pdf.setFontSize(12);
      pdf.text(anamnesis.observations, 20, yPosition);
      yPosition += lineHeight * 1.5;
    }

    // Plano de Ação
    pdf.setFontSize(14);
    pdf.text("Plano de Ação:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(anamnesis.action_plan || "Não informado", 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Próximo Acompanhamento
    pdf.setFontSize(14);
    pdf.text("Próximo Acompanhamento:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(
      anamnesis.next_visit 
        ? format(new Date(anamnesis.next_visit), "d 'de' MMMM, yyyy", { locale: ptBR })
        : "Não agendado",
      20,
      yPosition
    );

    // Download do PDF
    pdf.save(`anamnese-social-${anamnesis.patient_name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const filteredAnamneses = anamneses.filter(anamnesis =>
    anamnesis.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string | null) => {
    if (!date) return "Não agendado";
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Anamneses Sociais</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Nova Anamnese</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <NewSocialAnamnesis onSuccess={loadAnamneses} />
            </SheetContent>
          </Sheet>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Buscar anamneses por nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Carregando anamneses sociais...</div>
          ) : filteredAnamneses.length === 0 ? (
            <div className="text-center text-gray-500">
              {searchTerm ? "Nenhuma anamnese encontrada" : "Nenhuma anamnese cadastrada"}
            </div>
          ) : (
            filteredAnamneses.map((anamnesis) => (
              <Card key={anamnesis.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{anamnesis.patient_name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Criado em {formatDate(anamnesis.created_at)}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => downloadPDF(anamnesis)}
                    >
                      Baixar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Situação Socioeconômica</p>
                      <p className="font-medium">{anamnesis.socioeconomic_status ? anamnesis.socioeconomic_status.substring(0, 100) + (anamnesis.socioeconomic_status.length > 100 ? '...' : '') : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Plano de Ação</p>
                      <p className="font-medium">{anamnesis.action_plan ? anamnesis.action_plan.substring(0, 100) + (anamnesis.action_plan.length > 100 ? '...' : '') : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Próximo Acompanhamento</p>
                      <p className="font-medium">{formatDate(anamnesis.next_visit)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SocialAnamnesis;
