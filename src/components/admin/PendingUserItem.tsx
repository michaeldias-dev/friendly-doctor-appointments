
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { UserProfile } from "@/types/user";
import UserBadge from "./UserBadge";
import DateDisplay from "./DateDisplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PendingUserItemProps {
  user: UserProfile;
  onApprove: (userId: string, approved: boolean) => void;
}

const PendingUserItem = ({ user, onApprove }: PendingUserItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReject = () => {
    onApprove(user.id, false);
    setIsDialogOpen(false);
  };

  return (
    <div 
      key={user.id} 
      className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center py-3 px-2 border-b last:border-0 rounded-md bg-amber-50"
    >
      <div className="lg:col-span-2">
        <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Aguardando aprovação</span>
        </div>
        <p className="font-medium">{user.first_name} {user.last_name}</p>
        <p className="text-xs text-gray-500 lg:hidden">
          {user.email}
        </p>
      </div>
      
      <div className="hidden lg:block overflow-hidden text-ellipsis">{user.email}</div>
      
      <div>{user.specialty || "-"}</div>
      
      <div>
        <UserBadge role={user.role} />
      </div>
      
      <DateDisplay date={user.created_at} />
      
      <div className="flex justify-end gap-2">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-500 hover:text-green-700 hover:bg-green-50 border-green-200"
            onClick={() => onApprove(user.id, true)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rejeitar Usuário</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja rejeitar o cadastro de <strong>{user.first_name} {user.last_name}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start gap-2 mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                >
                  Sim, rejeitar usuário
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PendingUserItem;
