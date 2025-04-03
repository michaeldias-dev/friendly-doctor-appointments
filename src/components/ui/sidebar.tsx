
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ClipboardList,
  Home,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const checkIfAdmin = async () => {
      // Verificar se o usuário é admin (primeiro usuário)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: firstUser } = await supabase
          .from('profiles')
          .select('id')
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        setIsAdmin(firstUser?.id === user.id);
      }
    };
    
    checkIfAdmin();
  }, []);

  const menuItems = [
    {
      to: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Painel",
    },
    {
      to: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
      label: "Consultas",
    },
    {
      to: "/records",
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Prontuários",
    },
    {
      to: "/profile",
      icon: <User className="h-5 w-5" />,
      label: "Perfil",
    },
    ...(isAdmin ? [
      {
        to: "/admin/users",
        icon: <Users className="h-5 w-5" />,
        label: "Usuários",
      },
    ] : []),
  ];

  return (
    <>
      {/* Mobile menu trigger */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-white">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primary-600">
                    DEPAC CCB
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                      location.pathname === item.to
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <h2 className="text-lg font-semibold text-primary-600">DEPAC CCB</h2>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                    location.pathname === item.to
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
