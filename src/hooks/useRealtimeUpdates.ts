
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeUpdates = (tableName: string, onUpdate: () => void) => {
  useEffect(() => {
    const setupRealtimeListener = async () => {
      const channel = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: tableName }, 
          (payload) => {
            console.log(`Mudança detectada na tabela ${tableName}:`, payload);
            // Recarregar a lista quando houver mudanças
            onUpdate();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeListener();
  }, [tableName, onUpdate]);
};
