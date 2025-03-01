
import React from "react";
import { CardContent } from "@/components/ui/card";

const LoadingState = () => {
  return (
    <CardContent>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </CardContent>
  );
};

export default LoadingState;
