
import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export const generateAnamnesisPDF = (anamnesis: SocialAnamnesis) => {
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
