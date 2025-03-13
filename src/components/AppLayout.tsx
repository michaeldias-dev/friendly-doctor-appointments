
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  Layout,
  LogOut,
  Menu,
  User,
  Users,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    };
    
    checkUserRole();
  }, []);

  const navigation = [
    { name: "Painel", href: "/dashboard", icon: Layout },
    { name: "Consultas", href: "/appointments", icon: Calendar },
    { name: "Prontuários", href: "/records", icon: ClipboardList },
    { name: "Anamnese Social", href: "/social-anamnesis", icon: FileText },
    { name: "Perfil", href: "/profile", icon: User },
  ];

  // Adiciona o item de Administração apenas para administradores
  if (isAdmin) {
    navigation.push({ name: "Administração", href: "/admin/users", icon: Users });
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-40 md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md bg-white shadow-md">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h1 className="text-xl font-bold text-primary-700">MedSchedule</h1>
                  <button onClick={closeMobileMenu} className="p-1">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <nav className="flex-1 mt-4 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            isActive
                              ? "text-primary-700"
                              : "text-gray-400 group-hover:text-gray-500"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Sair
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <h1 className="text-lg font-semibold text-primary-600">MedSchedule</h1>
            </div>
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive
                            ? "text-primary-700"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link
                to="/"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sair
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          <main className="flex-1 pb-8">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
