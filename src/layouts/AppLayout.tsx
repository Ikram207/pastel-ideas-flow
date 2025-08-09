import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, PlusCircle, ListTodo, Home, UserPlus } from 'lucide-react';
import React from 'react';

const NavItem: React.FC<{ to: string; label: string; icon?: React.ReactNode }> = ({ to, label, icon }) => (
  <NavLink to={to} className={({ isActive }) => `px-3 py-2 rounded-md hover-scale ${isActive ? 'bg-secondary text-foreground' : 'text-foreground/80 hover:bg-secondary'} transition-colors`}>
    <span className="inline-flex items-center gap-2">{icon}{label}</span>
  </NavLink>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative">
        <div className="absolute inset-0 -z-10 gradient-surface" aria-hidden />
        <nav className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            Idées & Tâches
          </Link>
          <div className="flex items-center gap-1">
            <NavItem to="/" label="Tableau de bord" icon={<Home className="h-4 w-4" />} />
            <NavItem to="/ideas" label="Idées" icon={<ListTodo className="h-4 w-4" />} />
            <NavItem to="/ideas/new" label="Créer" icon={<PlusCircle className="h-4 w-4" />} />
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-foreground/80 hidden sm:inline">{user.firstName} {user.lastName}</span>
                <Button variant="secondary" onClick={logout} className="inline-flex gap-2"><LogOut className="h-4 w-4" /> Déconnexion</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="secondary" className="inline-flex gap-2"><LogIn className="h-4 w-4" /> Login</Button></Link>
                <Link to="/signup"><Button className="inline-flex gap-2"><UserPlus className="h-4 w-4" /> Inscription</Button></Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto py-8 flex-1 animate-fade-in">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 text-sm text-muted-foreground">© {new Date().getFullYear()} Idées & Tâches</div>
      </footer>
    </div>
  );
};

export default AppLayout;
