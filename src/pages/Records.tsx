
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NewRecord from "@/components/NewRecord";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

interface MedicalRecord {
  id: string;
  patient_name: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  next_visit: string | null;
  created_at: string;
}

const Records = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRecords(data || []);
    } catch (error) {
      console.error("Erro ao carregar prontuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [navigate]);

  const downloadPDF = (record: MedicalRecord) => {
    const pdf = new jsPDF();
    const lineHeight = 10;
    let yPosition = 20;

    // Título
    pdf.setFontSize(20);
    pdf.text("Prontuário Médico", 20, yPosition);
    yPosition += lineHeight * 2;

    // Informações do paciente
    pdf.setFontSize(12);
    pdf.text(`Paciente: ${record.patient_name}`, 20, yPosition);
    yPosition += lineHeight;
    
    pdf.text(`Data: ${format(new Date(record.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}`, 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Diagnóstico
    pdf.setFontSize(14);
    pdf.text("Diagnóstico:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(record.diagnosis, 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Tratamento
    pdf.setFontSize(14);
    pdf.text("Tratamento:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(record.treatment, 20, yPosition);
    yPosition += lineHeight * 1.5;

    // Observações (se houver)
    if (record.notes) {
      pdf.setFontSize(14);
      pdf.text("Observações:", 20, yPosition);
      yPosition += lineHeight;
      pdf.setFontSize(12);
      pdf.text(record.notes, 20, yPosition);
      yPosition += lineHeight * 1.5;
    }

    // Próxima visita
    pdf.setFontSize(14);
    pdf.text("Próxima Visita:", 20, yPosition);
    yPosition += lineHeight;
    pdf.setFontSize(12);
    pdf.text(
      record.next_visit 
        ? format(new Date(record.next_visit), "d 'de' MMMM, yyyy", { locale: ptBR })
        : "Não agendada",
      20,
      yPosition
    );

    // Download do PDF
    pdf.save(`prontuario-${record.patient_name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const filteredRecords = records.filter(record =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string | null) => {
    if (!date) return "Não agendada";
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prontuários Médicos</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Novo Prontuário</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <NewRecord onSuccess={loadRecords} />
            </SheetContent>
          </Sheet>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Buscar prontuários por nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Carregando prontuários...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center text-gray-500">
              {searchTerm ? "Nenhum prontuário encontrado" : "Nenhum prontuário cadastrado"}
            </div>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{record.patient_name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Criado em {formatDate(record.created_at)}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => downloadPDF(record)}
                    >
                      Baixar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Diagnóstico</p>
                      <p className="font-medium">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tratamento</p>
                      <p className="font-medium">{record.treatment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Próxima Visita</p>
                      <p className="font-medium">{formatDate(record.next_visit)}</p>
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

export default Records;
