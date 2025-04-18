import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Award, UserIcon, KeyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_BASE_URL, API_ENDPOINTS } from '../services/apiConfig'; // Import de la configuration de l'API

const loginSchema = z.object({
  cin: z.string().min(1, "Le CIN est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cin: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Appel API avec la base URL et l'endpoint login configurés
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('certassist_user', JSON.stringify(user));
        localStorage.setItem('certassist_token', 'mock-token'); // à remplacer si JWT
        toast.success('Connexion réussie');
        
        if (user.role === 'ASSIST') {
          navigate('/profile');  // Redirection vers le profil si l'utilisateur est un assistant
        } else {
          navigate('/profile');  // Sinon, redirection vers le dashboard
        }
      } else {
        toast.error('CIN ou mot de passe invalide');
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 rounded-full bg-certassist-50 mb-4">
            <Award className="h-12 w-12 text-certassist-600" />
          </div>
          <h1 className="text-2xl font-bold logo-text">Portail Adouls</h1>
          <p className="text-gray-500 mt-2">Portail de gestion des certifications des Adouls</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="cin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifiant CIN - (Carte d'identité nationale)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...field}
                        placeholder="Entrez votre CIN"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-certassist-600 hover:bg-certassist-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">démonstration</p>
          <p className="text-xs text-gray-400">CIN: WXXXXXX / Mot de passe: *******</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
