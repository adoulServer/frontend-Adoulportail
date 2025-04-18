import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Award,
  UserIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Définir les éléments de navigation
  const navItems = [
    { path: '/dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={20} /> },
    { path: '/profile', label: 'Mon Profil', icon: <UserIcon size={20} /> },
    { path: '/adouls', label: 'Adouls', icon: <Users size={20} /> },
    { path: '/forms', label: 'Formulaires', icon: <FileText size={20} /> },
    { path: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  // Filtrer les éléments en fonction du rôle de l'utilisateur
  const filteredNavItems = user?.role === 'ASSIST'
    ? navItems.filter(item => item.path === '/profile' || item.path === '/forms') // Seules les pages "Profile" et "Forms" pour ASSIST
    : navItems; // Tous les éléments pour les autres rôles (par exemple, ADMIN)

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar flex flex-col text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-sidebar-border h-16">
        {!collapsed && (
          <div className="flex items-center">
            <Award className="h-8 w-8 text-certassist-500" />
            <span className="ml-2 font-bold text-lg text-white">Portail-Adouls</span>
          </div>
        )}
        {collapsed && <Award className="h-8 w-8 mx-auto text-certassist-500" />}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto bg-sidebar-accent hover:bg-sidebar-accent/80 p-1 rounded"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <div className="flex flex-col flex-grow py-4 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center py-3 px-4 mx-2 rounded-md transition-colors",
              location.pathname === item.path 
                ? "bg-sidebar-accent text-white" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-certassist-600 flex items-center justify-center text-white overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-certassist-600 flex items-center justify-center text-white overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className={cn(
            "flex items-center mt-4 w-full py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
