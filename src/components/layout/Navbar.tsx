
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user } = useAuth();
  
  return (
    <div className="h-16 px-6 flex items-center justify-between border-b bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      
        <div className="hidden md:flex items-center">
          <div className="w-8 h-8 rounded-full bg-certassist-600 flex items-center justify-center text-white overflow-hidden mr-2">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.nom} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
      
        <button className="p-2 rounded-lg hover:bg-gray-100 md:hidden">
          <Menu size={20} />
        </button>
      </div>
  );
};

export default Navbar;
