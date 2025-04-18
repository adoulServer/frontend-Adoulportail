import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Key } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '@/services/apiConfig';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [ville, setVille] = useState(user?.ville || '');
  const [region, setRegion] = useState(user?.region || '');
  const [code_postale, setCodePostale] = useState(user?.code_postale || '');
  
  const handleSave = async () => {
    try {
      const updatedUser = {
        username,
        email,
        phone,
        address,
        ville,
        region,
        code_postale,
      };
  
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_USER(user?.id)}`, // Utilise l'endpoint UPDATE_USER
        updatedUser,
        { headers: getAuthHeaders() } // Ajoute les headers avec le token d'authentification
      );
  
      if (response.status === 200) {
        alert('Les informations ont été mises à jour avec succès.');
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setAddress(response.data.address);
        setVille(response.data.ville);
        setRegion(response.data.region);
        setCodePostale(response.data.code_postale);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  };
  
  return (
    <AppLayout title="Mon Profil">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-1/3">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-certassist-100 flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-lg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-certassist-600" />
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800">{user?.username}</h2>
                <p className="text-gray-500">{user?.role}</p>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <User size={18} className="text-certassist-600" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Nom d'utilisateur</p>
                    <p className="text-sm font-medium">{user?.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <Mail size={18} className="text-certassist-600" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <Phone size={18} className="text-certassist-600" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium">{user?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <MapPin size={18} className="text-certassist-600" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Localisation</p>
                    <p className="text-sm font-medium">{`${user?.address}, ${user?.ville}`}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <Tabs defaultValue="personal">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom Complet</Label>
                        <Input 
                          id="fullName" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                          id="phone" 
                          type="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                        />
                      </div>                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Input id="role" value={user?.role} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input 
                          id="city" 
                          value={ville} 
                          onChange={(e) => setVille(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="region">Région</Label>
                        <Input 
                          id="region" 
                          value={region} 
                          onChange={(e) => setRegion(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zip">Code Postal</Label>
                        <Input 
                          id="zip" 
                          value={code_postale} 
                          onChange={(e) => setCodePostale(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="bg-certassist-600 hover:bg-certassist-700">
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>              
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
