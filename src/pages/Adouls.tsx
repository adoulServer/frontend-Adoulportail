// src/pages/Adouls.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, UserPlus, Mail, Phone, MapPin, Tag, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adoulService, Adoul } from '../services/adoulService';
import { Eye } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '@/services/apiConfig';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileSpreadsheet } from 'lucide-react';


const Adouls: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdoul, setSelectedAdoul] = useState<Adoul | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [totalPrix, setTotalPrix] = useState<number>(0);
  const [newAdoul, setNewAdoul] = useState<Omit<Adoul, 'id'>>({
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    phone: '',
    location: '',
    status: 'Actif',
    certifications: [],
  });

  const {
    data: adouls = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['adouls'],
    queryFn: () => adoulService.getAllAdouls(),
  });

  useEffect(() => {
    fetch(API_BASE_URL + API_ENDPOINTS.TOTAL_CERTIFICATION_PRIX, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setTotalPrix(data))
      .catch((err) => console.error("Erreur chargement somme des prix:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      const day = now.getDate();
      setIsDeleteEnabled(day === 30 || day === 31);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const exportToExcel = () => {
    const exportData = filteredAdouls.map(adoul => ({
      Nom: adoul.nom,
      Prenom: adoul.prenom,
      CIN: adoul.cin,
      Email: adoul.email,
      Téléphone: adoul.phone,
      Localisation: adoul.location,
      Statut: adoul.status,
      'Nombre de Certifications': adoul.certifications.length,
      'Total Prix Certifications': adoul.certifications.reduce((total, cert) => total + cert.prix, 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adouls');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'liste_adouls.xlsx');
  };

  const handleAddAdoul = async () => {
    if (!newAdoul.nom || !newAdoul.email || !newAdoul.phone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await adoulService.createAdoul(newAdoul);
      toast({
        title: 'Succès',
        description: "L'adoul a été ajouté avec succès.",
      });
      setNewAdoul({
        nom: '',
        prenom: '',
        cin: '',
        email: '',
        phone: '',
        location: '',
        status: 'Actif',
        certifications: [],
      });
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdoul((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAdoul((prev) => ({ ...prev, [name]: value }));
  };

  const filteredAdouls = adouls.filter(
    (adoul) =>
      adoul.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoul.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoul.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleDeleteAllCertifications = async () => {
    try {
      const response = await fetch('electoral-cal-raoufabdelhafidjunior-53c6fab0.koyeb.app/api/certifications/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
  
      alert('Toutes les certifications ont été supprimées.');
      // Mettre à jour l'état ou recharger les données si nécessaire
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur s\'est produite.');
    }
  };
  

  return (
    <AppLayout title="Gestion des Adouls">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Rechercher un adoul..."
            className="pl-10 w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center">

          {/* Horloge */}
          <div className={`text-lg font-semibold ${isDeleteEnabled ? 'text-red-600' : 'text-gray-700'}`}>
            {currentDate.toLocaleString('fr-FR')}
          </div>

          {/* Bouton Supprimer */}
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!isDeleteEnabled}
            onClick={handleDeleteAllCertifications}
          >
            Supprimer toutes les certifications
          </Button>

          {/* Bouton Somme totale */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-certassist-600 hover:bg-certassist-700">
                💰 Somme totale : {totalPrix} DH
              </Button>
            </DialogTrigger>
          </Dialog>

          {/* Export Excel */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FileSpreadsheet size={16} className="text-green-600" />
            Export Excel
          </Button>

        </div>

      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-certassist-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Une erreur est survenue lors du chargement des données. Veuillez réessayer.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prenom</TableHead>
                <TableHead>Cin</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead>Total Prix Certifications</TableHead>
                <TableHead>Plus d'informations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdouls.length > 0 ? (
                filteredAdouls.map((adoul) => (
                  <TableRow key={adoul.id}>
                    <TableCell className="font-medium">{adoul.nom}</TableCell>
                    <TableCell className="font-medium">{adoul.prenom}</TableCell>
                    <TableCell className="font-medium">{adoul.cin}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          {adoul.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          {adoul.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-400" />
                        {adoul.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={adoul.status === 'Actif' ? 'default' : 'secondary'}>
                        {adoul.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Award size={14} className="mr-1 text-certassist-600" />
                        {adoul.certifications.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      {adoul.certifications?.reduce((total: number, cert: { prix: number }) => total + cert.prix, 0)} DH
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAdoul(adoul)}
                          >
                            <Eye size={16} className="text-certassist-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>
                              Certifications de {adoul.nom} {adoul.prenom}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {adoul.certifications.length > 0 ? (
                              <table className="w-full text-sm text-left border rounded-lg overflow-hidden shadow-sm mt-2">
                                <thead className="bg-gray-100 text-gray-700">
                                  <tr>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Prix</th>
                                    <th className="px-4 py-2">Demandeur</th>
                                    <th className="px-4 py-2">Date de création</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {adoul.certifications.map((certif: any, index: number) => (
                                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                                      <td className="px-4 py-2">{certif.type}</td>
                                      <td className="px-4 py-2">{certif.prix} DH</td>
                                      <td className="px-4 py-2">{certif.nomDemandeur}</td>
                                      <td className="px-4 py-2">{new Date(certif.dateCreation).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-500">Aucune certification trouvée.</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>


                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun adoul trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppLayout>
  );
};

export default Adouls;
