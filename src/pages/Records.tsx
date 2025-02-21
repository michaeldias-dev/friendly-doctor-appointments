
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewRecord from "@/components/NewRecord";

const Records = () => {
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
              <NewRecord />
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
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>João Silva</CardTitle>
                    <p className="text-sm text-gray-500">Criado em 1 de Abril, 2024</p>
                  </div>
                  <Button variant="outline">Baixar PDF</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Diagnóstico</p>
                    <p className="font-medium">Consulta de Rotina</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tratamento</p>
                    <p className="font-medium">Medicação Prescrita</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Próxima Visita</p>
                    <p className="font-medium">Em 3 meses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Records;
