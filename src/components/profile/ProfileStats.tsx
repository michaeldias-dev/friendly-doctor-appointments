
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileStats() {
  return (
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
  );
}
