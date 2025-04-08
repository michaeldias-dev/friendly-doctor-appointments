
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

export const useUserData = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles - RLS policies will automatically restrict access based on user role
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at, role, email')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Profiles loaded:", profilesData);
      
      // Sort users - pending first, then rejected, then approved by most recent date
      const sortedUsers = profilesData.sort((a, b) => {
        // Pending users (approved is null)
        if (a.approved === null && b.approved !== null) return -1;
        if (a.approved !== null && b.approved === null) return 1;
        
        // Rejected users (approved is false)
        if (a.approved === false && b.approved === true) return -1;
        if (a.approved === true && b.approved === false) return 1;
        
        // Then by most recent date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(sortedUsers);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    users,
    isLoading,
    loadUsers
  };
};
