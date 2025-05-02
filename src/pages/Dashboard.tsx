import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Users, FileText, Calendar, TrendingUp, Award, DollarSign } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '@/services/apiConfig';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [totalAdouls, setTotalAdouls] = useState<number>(0);
  const [totalCertification, setTotalCertification] = useState<number>(0);
  const [totalPrix, setTotalPrix] = useState<number>(0);

  // Rafraîchissement automatique toutes les 5s
  useEffect(() => {
    const fetchAdoulsCount = () => {
      fetch(API_BASE_URL + API_ENDPOINTS.ADOULS_COUNT, {
        headers: getAuthHeaders(),
      })
        .then(response => response.json())
        .then(data => setTotalAdouls(data))
        .catch(error => console.error('Error fetching total adouls:', error));
    };

    const fetchCertificationsCount = () => {
      fetch(API_BASE_URL + API_ENDPOINTS.CERTIFICATIONS_COUNT, {
        headers: getAuthHeaders(),
      })
        .then(response => response.json())
        .then(data => setTotalCertification(data))
        .catch(error => console.error('Error fetching total certifications:', error));
    };

    const fetchTotalPrix = () => {
      fetch(API_BASE_URL + API_ENDPOINTS.TOTAL_CERTIFICATION_PRIX, {
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => setTotalPrix(data))
        .catch((err) => console.error("Erreur chargement somme des prix:", err));
    };

    const refreshData = () => {
      fetchAdoulsCount();
      fetchCertificationsCount();
      fetchTotalPrix();
    };

    refreshData(); // premier appel
    const interval = setInterval(refreshData, 5000); // toutes les 5s

    return () => clearInterval(interval); // nettoyage
  }, []);

  // Certification list with auto-refresh every 5s
  const fetchCertifications = async () => {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CERTIFICATIONS}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  };

  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: fetchCertifications,
    refetchInterval: 1000,
  });

  const stats = [
    {
      title: 'Total Adouls',
      value: totalAdouls,
      icon: <Users className="h-8 w-8 text-certassist-600" />
    },
    {
      title: 'Certifications',
      value: '6',
      icon: <Award className="h-8 w-8 text-certassist-600" />
    },
    {
      title: 'Formulaires',
      value: totalCertification,
      icon: <FileText className="h-8 w-8 text-certassist-600" />
    },
    {
      title: 'Total Revenue',
      value: `${new Intl.NumberFormat('fr-MA').format(totalPrix)} DH`,
      icon: <DollarSign className="h-8 w-8 text-certassist-600" />
    }
  ];

  return (
    <AppLayout title="Tableau de Bord">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Bienvenue, {user?.username}</h2>
        <p className="text-gray-500">Voici un aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full p-3 bg-certassist-50">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                    {stat.change}
                    <TrendingUp size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoading ? (
                <p>Chargement...</p>
              ) : certifications.length === 0 ? (
                <p>Aucune demande récente.</p>
              ) : (
                certifications
                  .slice()
                  .map((cert, index) => {
                    const date = new Date(cert.dateCreation);
                    return (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-certassist-100 flex items-center justify-center text-certassist-600">
                          <FileText size={20} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Certification de {cert.type} demandée par {cert.nomDemandeur}
                          </p>
                          <p className="text-sm text-gray-500">
                            {date.toLocaleDateString('fr-MA', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}{' '}
                            à {date.toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-certassist-100 flex items-center justify-center overflow-hidden mb-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                ) : (
                  <Users size={40} className="text-certassist-600" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{user?.username}</h3>
              <p className="text-gray-500">{user?.role}</p>

              <div className="w-full mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Utilisateur</span>
                  <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID</span>
                  <span className="text-sm font-medium text-gray-900">{user?.cin}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
