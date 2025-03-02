
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

      if (profilesError) throw profilesError;

      console.log("Profiles loaded:", profilesData);
      
      // Sort users - pending first, then by most recent date
      const sortedUsers = profilesData.sort((a, b) => {
        // Unapproved users first (if approved is null or false)
        if ((a.approved === null || a.approved === false) && (b.approved === true)) return -1;
        if ((a.approved === true) && (b.approved === null || b.approved === false)) return 1;
        
        // Then by most recent date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Could not load users",
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
