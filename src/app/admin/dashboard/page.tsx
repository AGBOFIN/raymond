'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, User, Briefcase, Mail, Phone, MapPin, 
  LogOut, Save, Plus, Trash2, Edit, Users, Calendar, DollarSign,
  Image, MessageSquare, BarChart3, Upload, X
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [contentRes, servicesRes, statsRes, patientsRes, imagesRes, testimonialsRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/services'),
        fetch('/api/admin/stats'),
        fetch('/api/patients'),
        fetch('/api/images'),
        fetch('/api/testimonials')
      ]);
      
      setContent(await contentRes.json());
      setServices(await servicesRes.json());
      setStats(await statsRes.json());
      const patientsData = await patientsRes.json();
      setPatients(patientsData.patients || []);
      setImages(await imagesRes.json());
      setTestimonials(await testimonialsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async (patientId?: number) => {
    try {
      const url = patientId ? `/api/sessions?patientId=${patientId}` : '/api/sessions';
      const res = await fetch(url);
      setSessions(await res.json());
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleContentChange = (key: string, value: string) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      for (const [key, value] of Object.entries(content)) {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        });
      }
      setSaveMessage('Contenu enregistré avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erreur lors de l\'enregistrement');
    }

    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    document.cookie = 'adminUser=; path=/; max-age=0';
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Rehab Connect - Administration</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-24">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'general' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                Général
              </button>
              <button
                onClick={() => setActiveTab('therapist')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'therapist' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                Kinésithérapeute
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'services' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Services
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-5 h-5" />
                Contact
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'patients' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                Patients
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'sessions' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Séances
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'images' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Image className="w-5 h-5" />
                Images
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'testimonials' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Témoignages
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {saveMessage && (
                <div className={`mb-6 p-4 rounded-lg ${saveMessage.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {saveMessage}
                </div>
              )}

              {activeTab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
                  
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Patients totaux</p>
                          <p className="text-3xl font-bold mt-1">{stats.totalPatients}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Séances aujourd'hui</p>
                          <p className="text-3xl font-bold mt-1">{stats.todaySessions}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Revenus du jour</p>
                          <p className="text-3xl font-bold mt-1">{stats.todayRevenue.toLocaleString()} FCFA</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Revenus du mois</p>
                          <p className="text-3xl font-bold mt-1">{stats.monthRevenue.toLocaleString()} FCFA</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Patients */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients récents</h3>
                    <div className="space-y-2">
                      {stats.recentPatients.map((patient: any) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{patient.first_name} {patient.last_name}</p>
                            <p className="text-sm text-gray-600">{patient.phone}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Sessions */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Séances à venir (7 jours)</h3>
                    <div className="space-y-2">
                      {stats.upcomingSessions.length > 0 ? (
                        stats.upcomingSessions.map((session: any) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{session.first_name} {session.last_name}</p>
                              <p className="text-sm text-gray-600">{new Date(session.session_date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {session.session_type || 'Non spécifié'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune séance prévue</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu général</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la page d'accueil
                    </label>
                    <input
                      type="text"
                      value={content.hero_title || ''}
                      onChange={(e) => handleContentChange('hero_title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sous-titre de la page d'accueil
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero_subtitle || ''}
                      onChange={(e) => handleContentChange('hero_subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'therapist' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations du kinésithérapeute</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={content.therapist_name || ''}
                      onChange={(e) => handleContentChange('therapist_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={content.therapist_title || ''}
                      onChange={(e) => handleContentChange('therapist_title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biographie
                    </label>
                    <textarea
                      rows={4}
                      value={content.therapist_bio || ''}
                      onChange={(e) => handleContentChange('therapist_bio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formation
                    </label>
                    <input
                      type="text"
                      value={content.therapist_education || ''}
                      onChange={(e) => handleContentChange('therapist_education', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mention
                    </label>
                    <input
                      type="text"
                      value={content.therapist_mention || ''}
                      onChange={(e) => handleContentChange('therapist_mention', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Établissement
                    </label>
                    <input
                      type="text"
                      value={content.therapist_school || ''}
                      onChange={(e) => handleContentChange('therapist_school', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                  
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Titre
                            </label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[index].title = e.target.value;
                                setServices(updated);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={service.description}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[index].description = e.target.value;
                                setServices(updated);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Icône (Activity, HeartPulse, Bone, Hand)
                            </label>
                            <input
                              type="text"
                              value={service.icon}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[index].icon = e.target.value;
                                setServices(updated);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={content.contact_phone || ''}
                        onChange={(e) => handleContentChange('contact_phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="text"
                        value={content.contact_whatsapp || ''}
                        onChange={(e) => handleContentChange('contact_whatsapp', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={content.contact_email || ''}
                        onChange={(e) => handleContentChange('contact_email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={content.contact_address || ''}
                        onChange={(e) => handleContentChange('contact_address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Réseaux sociaux</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-gray-400 mt-3 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={content.facebook_url || ''}
                          onChange={(e) => handleContentChange('facebook_url', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                      <div className="w-5 h-5 text-gray-400 mt-3 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={content.instagram_url || ''}
                          onChange={(e) => handleContentChange('instagram_url', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                      <div className="w-5 h-5 text-gray-400 mt-3 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={content.linkedin_url || ''}
                          onChange={(e) => handleContentChange('linkedin_url', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des patients</h2>
                    <button
                      onClick={() => setShowPatientForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Nouveau patient
                    </button>
                  </div>

                  {showPatientForm && (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">Ajouter un patient</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const patientData = {
                          first_name: formData.get('first_name'),
                          last_name: formData.get('last_name'),
                          date_of_birth: formData.get('date_of_birth'),
                          phone: formData.get('phone'),
                          email: formData.get('email'),
                          address: formData.get('address'),
                          emergency_contact_name: formData.get('emergency_contact_name'),
                          emergency_contact_phone: formData.get('emergency_contact_phone'),
                          medical_history: formData.get('medical_history'),
                          notes: formData.get('notes')
                        };
                        await fetch('/api/patients', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(patientData)
                        });
                        setShowPatientForm(false);
                        fetchData();
                      }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="first_name" placeholder="Prénom" required className="px-4 py-2 border rounded-lg" />
                        <input name="last_name" placeholder="Nom" required className="px-4 py-2 border rounded-lg" />
                        <input name="date_of_birth" type="date" className="px-4 py-2 border rounded-lg" />
                        <input name="phone" placeholder="Téléphone" required className="px-4 py-2 border rounded-lg" />
                        <input name="email" type="email" placeholder="Email" className="px-4 py-2 border rounded-lg" />
                        <input name="address" placeholder="Adresse" className="px-4 py-2 border rounded-lg" />
                        <input name="emergency_contact_name" placeholder="Contact urgence (nom)" className="px-4 py-2 border rounded-lg" />
                        <input name="emergency_contact_phone" placeholder="Contact urgence (téléphone)" className="px-4 py-2 border rounded-lg" />
                        <textarea name="medical_history" placeholder="Antécédents médicaux" className="px-4 py-2 border rounded-lg md:col-span-2" rows={2} />
                        <textarea name="notes" placeholder="Notes" className="px-4 py-2 border rounded-lg md:col-span-2" rows={2} />
                        <div className="md:col-span-2 flex gap-2">
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
                          <button type="button" onClick={() => setShowPatientForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Annuler</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{patient.first_name} {patient.last_name}</p>
                          <p className="text-sm text-gray-600">{patient.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedPatient(patient); fetchSessions(patient.id); setActiveTab('sessions'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button onClick={() => setSelectedPatient(patient)} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={async () => {
                            if (confirm('Supprimer ce patient ?')) {
                              await fetch(`/api/patients/${patient.id}`, { method: 'DELETE' });
                              fetchData();
                            }
                          }} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des séances</h2>
                    <button
                      onClick={() => setShowSessionForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Nouvelle séance
                    </button>
                  </div>

                  {showSessionForm && (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">Ajouter une séance</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const sessionData = {
                          patient_id: formData.get('patient_id'),
                          session_date: formData.get('session_date'),
                          session_type: formData.get('session_type'),
                          status: formData.get('status'),
                          notes: formData.get('notes'),
                          price: formData.get('price'),
                          amount_paid: formData.get('amount_paid'),
                          payment_status: formData.get('payment_status'),
                          payment_date: formData.get('payment_date')
                        };
                        await fetch('/api/sessions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(sessionData)
                        });
                        setShowSessionForm(false);
                        fetchSessions();
                      }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select name="patient_id" required className="px-4 py-2 border rounded-lg">
                          <option value="">Sélectionner un patient</option>
                          {patients.map((p) => (
                            <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                          ))}
                        </select>
                        <input name="session_date" type="date" required className="px-4 py-2 border rounded-lg" />
                        <select name="session_type" className="px-4 py-2 border rounded-lg">
                          <option value="">Type de séance</option>
                          <option value="reeducation">Rééducation</option>
                          <option value="massage">Massage</option>
                          <option value="post_op">Post-opératoire</option>
                          <option value="sport">Sportive</option>
                        </select>
                        <select name="status" required className="px-4 py-2 border rounded-lg">
                          <option value="planned">Prévue</option>
                          <option value="completed">Réalisée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                        <input name="price" type="number" placeholder="Prix (FCFA)" className="px-4 py-2 border rounded-lg" />
                        <input name="amount_paid" type="number" placeholder="Montant payé (FCFA)" className="px-4 py-2 border rounded-lg" />
                        <select name="payment_status" className="px-4 py-2 border rounded-lg">
                          <option value="pending">En attente</option>
                          <option value="paid">Payé</option>
                        </select>
                        <input name="payment_date" type="date" className="px-4 py-2 border rounded-lg" />
                        <textarea name="notes" placeholder="Notes" className="px-4 py-2 border rounded-lg md:col-span-2" rows={2} />
                        <div className="md:col-span-2 flex gap-2">
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
                          <button type="button" onClick={() => setShowSessionForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Annuler</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{session.first_name} {session.last_name}</p>
                          <p className="text-sm text-gray-600">{new Date(session.session_date).toLocaleDateString('fr-FR')} - {session.session_type || 'Non spécifié'}</p>
                          <p className="text-sm text-gray-500">{session.price} FCFA - {session.payment_status === 'paid' ? 'Payé' : 'En attente'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.status === 'completed' ? 'bg-green-100 text-green-700' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {session.status === 'completed' ? 'Réalisée' : session.status === 'cancelled' ? 'Annulée' : 'Prévue'}
                          </span>
                          <button onClick={() => setSelectedSession(session)} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={async () => {
                            if (confirm('Supprimer cette séance ?')) {
                              await fetch(`/api/sessions/${session.id}`, { method: 'DELETE' });
                              fetchSessions();
                            }
                          }} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des images</h2>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Glissez-déposez une image ou cliquez pour sélectionner</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('category', 'gallery');
                          formData.append('altText', file.name);
                          await fetch('/api/images', {
                            method: 'POST',
                            body: formData
                          });
                          fetchData();
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Upload className="w-5 h-5" />
                      Choisir une image
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img src={image.path} alt={image.alt_text || ''} className="w-full h-32 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button onClick={async () => {
                            if (confirm('Supprimer cette image ?')) {
                              await fetch(`/api/images?id=${image.id}`, { method: 'DELETE' });
                              fetchData();
                            }
                          }} className="p-2 bg-red-600 text-white rounded hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Modération des témoignages</h2>

                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className={`p-4 border rounded-lg ${testimonial.is_approved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{testimonial.patient_name}</p>
                            <p className="text-sm text-gray-600 mt-1">{testimonial.content}</p>
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!testimonial.is_approved && (
                              <button onClick={async () => {
                                await fetch(`/api/testimonials/${testimonial.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ is_approved: true })
                                });
                                fetchData();
                              }} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                Approuver
                              </button>
                            )}
                            <button onClick={async () => {
                              if (confirm('Supprimer ce témoignage ?')) {
                                await fetch(`/api/testimonials/${testimonial.id}`, { method: 'DELETE' });
                                fetchData();
                              }
                            }} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button - Only show for content editing tabs */}
              {['general', 'therapist', 'services', 'contact'].includes(activeTab) && (
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
