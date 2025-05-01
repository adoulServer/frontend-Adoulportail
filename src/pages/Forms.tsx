import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adoulService } from '../services/adoulService';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../services/apiConfig';

const fetchCertifications = async () => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CERTIFICATIONS}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const Forms: React.FC = () => {
  const { data: adouls = [], isLoading, isError } = useQuery({
    queryKey: ['adouls'],
    queryFn: adoulService.getAllAdouls,
  });

  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [certificateTypes, setCertificateTypes] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    certType: '',
    requesterName: '',
    requesterPhone: '',
    adoulId: '',
    certPrice: 0,
    registreNumber: '',
    ichhadNumber: '',
  });

  useEffect(() => {
    const fetchCertificateTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CERTIFICATION_TYPES}`, {
          headers: getAuthHeaders(),
        });
        setCertificateTypes(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des types de certifications:', error);
      }
    };

    fetchCertificateTypes();
  }, []);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await fetchCertifications();
        setCertificates(data);
      } catch (error) {
        console.error('Erreur chargement certifications :', error);
      }
    };

    loadCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch =
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.nomDemandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.adoul.nom.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    if (
      !formData.certType ||
      !formData.requesterName ||
      !formData.adoulId ||
      Number(formData.certPrice) <= 0 ||
      Number(formData.registreNumber) <= 0 ||
      Number(formData.ichhadNumber) <= 0
    ) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
    
    
    const certificationTypeMapping = {
      "زواج": "ZAWAJ",
      "الأملاك": "AMLAK",
      "موجب": "MOJAB",
      "وكالة": "WAKALA",
      "وصية": "WASIYA",
      "إراثة": "IRATHA",
    };

    const certificationData = {
      type: certificationTypeMapping[formData.certType], 
      nomDemandeur: formData.requesterName,
      prix: parseFloat(formData.certPrice.toString()),
      adoulId: Number(formData.adoulId),
      registreNumber: Number(formData.registreNumber),
      ichhadNumber: Number(formData.ichhadNumber),
    };


    console.log('Données envoyées :', certificationData);  // Log des données avant envoi

    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.CERTIFICATIONS}`,
        certificationData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        alert('Demande soumise avec succès');
        setFormData({
          certType: '',
          requesterName: '',
          requesterPhone: '',
          adoulId: '',
          certPrice: 0,
          registreNumber: '',
          ichhadNumber: '',
        });
        const refreshed = await fetchCertifications();
        setCertificates(refreshed);
      } else {
        alert('Erreur lors de la soumission');
      }
    } catch (error: any) {
      console.error('Erreur lors de la soumission :', error);
      if (error.response) {
        alert(`Erreur serveur: ${error.response.data.message || error.response.statusText}`);
      } else {
        alert("Une erreur s'est produite lors de la soumission");
      }
    }
  };

  if (isLoading) return <div>Chargement des adouls...</div>;
  if (isError) return <div>Erreur lors du chargement des adouls.</div>;

  const handleDownload = async (certificationId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CERTIFICATIONS}/${certificationId}/download-word-template`,
        {
          responseType: 'blob',
          headers: getAuthHeaders(),
        }
      );
  
      // Crée un lien de téléchargement temporaire
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certification_${certificationId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement certification:', error);
      alert('Erreur lors du téléchargement du fichier.');
    }
  };
  

  return (
    <AppLayout title="Gestion des Formulaires">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Formulaires</h2>
          <p className="text-gray-500">Gérez les demandes de certification</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input value={searchTerm} onChange={handleSearchChange} placeholder="Rechercher..." className="pl-9" />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-certassist-600 hover:bg-certassist-700">
                <Plus size={16} className="mr-2" /> Nouvelle demande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle demande de certification</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="certType">Type de certification</Label>
                    <select
                      id="certType"
                      value={formData.certType}
                      onChange={handleFormChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Sélectionnez un type</option>
                      {certificateTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requesterName">Nom du demandeur</Label>
                    <Input id="requesterName" value={formData.requesterName} onChange={handleFormChange} placeholder="Nom complet" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adoulId">Adoul</Label>
                    <select
                      id="adoulId"
                      value={formData.adoulId}
                      onChange={handleFormChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Sélectionnez un adoul</option>
                      {adouls.map(adoul => (
                        <option key={adoul.id} value={adoul.id}>
                          {adoul.nom} {adoul.prenom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certPrice">Prix (DH)</Label>
                    <Input id="certPrice" type="number" value={formData.certPrice} onChange={handleFormChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registreNumber">Registre</Label>
                    <Input id="registreNumber" type="number" value={formData.registreNumber} onChange={handleFormChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ichhadNumber">Ich-hade</Label>
                    <Input id="ichhadNumber" type="number" value={formData.ichhadNumber} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button className="bg-certassist-600 hover:bg-certassist-700" type="submit">Soumettre</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="all">Toutes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="px-6">
              <CardTitle>Demandes de certification</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="cert-table w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Demandeur</th>
                    <th className="px-4 py-3 text-left">Adoul</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Prix</th>
                    <th className="px-4 py-3 text-left">Registre</th>
                    <th className="px-4 py-3 text-left">Ich-hade</th>
                    <th className="px-4 py-3 text-left">Télécharger</th> {/* <-- ajout */}
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map(cert => (
                      <tr key={cert.id}>
                        <td className="px-4 py-3">{cert.type}</td>
                        <td className="px-4 py-3">{cert.nomDemandeur}</td>
                        <td className="px-4 py-3">{cert.adoul.nom} {cert.adoul.prenom}</td>
                        <td className="px-4 py-3">{new Date(cert.dateCreation).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{cert.prix} DH</td>
                        <td className="px-4 py-3">{cert.registreNumber}</td>
                        <td className="px-4 py-3">{cert.ichhadNumber}</td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(cert.id)}
                          >
                            Télécharger
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6">Aucune demande trouvée.</td>
                    </tr>
                  )}
                </tbody>

              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Forms;
