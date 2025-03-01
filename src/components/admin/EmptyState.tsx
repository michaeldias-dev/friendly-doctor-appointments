
import React from "react";
import { CardContent } from "@/components/ui/card";

const EmptyState = () => {
  return (
    <CardContent>
      <div className="text-center py-10 text-gray-500">
        <p>Nenhum usuário encontrado</p>
      </div>
    </CardContent>
  );
};

export default EmptyState;
