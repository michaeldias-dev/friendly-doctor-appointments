
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SocialAnamnesisForm } from "./types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SocialConditionsFieldsProps {
  form: UseFormReturn<SocialAnamnesisForm>;
}

const SocialConditionsFields = ({ form }: SocialConditionsFieldsProps) => {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">Condições Sociais</h3>
      
      <FormField
        control={form.control}
        name="housingConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições de Moradia</FormLabel>
            <FormControl>
              <Input 
                placeholder="Descreva as condições de moradia" 
                {...field} 
                className="h-11 bg-white" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socioeconomicStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situação Socioeconômica</FormLabel>
            <FormControl>
              <Input 
                placeholder="Descreva a situação socioeconômica" 
                {...field} 
                className="h-11 bg-white" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="socialBenefit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefício Social</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Selecione o benefício social" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                <SelectItem value="nenhum">Nenhum</SelectItem>
                <SelectItem value="bolsa_familia">Bolsa Família</SelectItem>
                <SelectItem value="bpc">BPC (Benefício de Prestação Continuada)</SelectItem>
                <SelectItem value="auxilio_brasil">Auxílio Brasil</SelectItem>
                <SelectItem value="auxilio_emergencial">Auxílio Emergencial</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SocialConditionsFields;
