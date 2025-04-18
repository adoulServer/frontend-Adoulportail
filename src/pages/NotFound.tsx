
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-certassist-50">
            <FileQuestion className="h-16 w-16 text-certassist-600" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page introuvable</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée. Veuillez vérifier l'URL ou retourner à la page d'accueil.
        </p>
        
        <Link to="/dashboard">
          <Button className="flex items-center gap-2 bg-certassist-600 hover:bg-certassist-700">
            <ArrowLeft size={16} /> Retour au tableau de bord
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
