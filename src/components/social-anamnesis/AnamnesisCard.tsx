
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface AnamnesisCardProps {
  anamnesis: SocialAnamnesis;
  onDownload: (anamnesis: SocialAnamnesis) => void;
}

const AnamnesisCard = ({ anamnesis, onDownload }: AnamnesisCardProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "Não agendado";
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <Card>
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
            onClick={() => onDownload(anamnesis)}
          >
            Baixar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Situação Socioeconômica</p>
            <p className="font-medium">
              {anamnesis.socioeconomic_status 
                ? anamnesis.socioeconomic_status.substring(0, 100) + (anamnesis.socioeconomic_status.length > 100 ? '...' : '') 
                : 'Não informado'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Plano de Ação</p>
            <p className="font-medium">
              {anamnesis.action_plan 
                ? anamnesis.action_plan.substring(0, 100) + (anamnesis.action_plan.length > 100 ? '...' : '') 
                : 'Não informado'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Próximo Acompanhamento</p>
            <p className="font-medium">{formatDate(anamnesis.next_visit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnamnesisCard;
