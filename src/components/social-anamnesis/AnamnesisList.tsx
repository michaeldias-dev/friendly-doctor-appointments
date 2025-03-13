
import AnamnesisCard from "./AnamnesisCard";

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

interface AnamnesisListProps {
  anamneses: SocialAnamnesis[];
  searchTerm: string;
  isLoading: boolean;
  onDownload: (anamnesis: SocialAnamnesis) => void;
}

const AnamnesisList = ({ anamneses, searchTerm, isLoading, onDownload }: AnamnesisListProps) => {
  const filteredAnamneses = anamneses.filter(anamnesis =>
    anamnesis.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center text-gray-500">Carregando anamneses sociais...</div>;
  }

  if (filteredAnamneses.length === 0) {
    return (
      <div className="text-center text-gray-500">
        {searchTerm ? "Nenhuma anamnese encontrada" : "Nenhuma anamnese cadastrada"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAnamneses.map((anamnesis) => (
        <AnamnesisCard 
          key={anamnesis.id} 
          anamnesis={anamnesis} 
          onDownload={onDownload} 
        />
      ))}
    </div>
  );
};

export default AnamnesisList;
