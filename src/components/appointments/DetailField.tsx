
import React from "react";

export interface DetailFieldProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

const DetailField = ({ label, value, className }: DetailFieldProps) => {
  if (value === null || value === undefined) return null;
  
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className={`text-md text-gray-900 ${className || ''}`}>{value}</p>
    </div>
  );
};

export default DetailField;
