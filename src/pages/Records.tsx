
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Records = () => {
  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <Button>New Record</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search records by patient name..."
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
                    <CardTitle>John Doe</CardTitle>
                    <p className="text-sm text-gray-500">Created on April 1, 2024</p>
                  </div>
                  <Button variant="outline">Download PDF</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Diagnosis</p>
                    <p className="font-medium">General Checkup</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Treatment</p>
                    <p className="font-medium">Prescribed Medication</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Visit</p>
                    <p className="font-medium">In 3 months</p>
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
