
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    specialty: string;
    bio: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onChange: (field: string, value: string) => void;
}

export function ProfileForm({ profile, isEditing, isLoading, onSubmit, onChange }: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Especialização</Label>
        <Input
          id="specialization"
          value={profile.specialty}
          onChange={(e) => onChange("specialty", e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia</Label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          readOnly={!isEditing}
          className="h-32"
        />
      </div>

      {isEditing && (
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      )}
    </form>
  );
}
