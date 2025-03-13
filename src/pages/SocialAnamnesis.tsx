
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useSocialAnamnesis } from "@/hooks/useSocialAnamnesis";
import { generateAnamnesisPDF } from "@/utils/pdf-generator";
import PageHeader from "@/components/social-anamnesis/PageHeader";
import SearchBar from "@/components/social-anamnesis/SearchBar";
import AnamnesisList from "@/components/social-anamnesis/AnamnesisList";

const SocialAnamnesis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { anamneses, isLoading, refreshAnamneses } = useSocialAnamnesis();

  return (
    <AppLayout>
      <div className="animate-in">
        <PageHeader onAnamnesisCreated={refreshAnamneses} />
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        <AnamnesisList 
          anamneses={anamneses} 
          searchTerm={searchTerm}
          isLoading={isLoading}
          onDownload={generateAnamnesisPDF}
        />
      </div>
    </AppLayout>
  );
};

export default SocialAnamnesis;
