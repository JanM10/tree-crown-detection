// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import StatsCards from '../components/StatsCards';
import SpeciesChart from '../components/SpeciesChart';
import Loading from '../components/Loading';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section Mejorada */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Tree Crown Detection
          </h1>
          <p className="text-xl text-green-100 mb-2 font-medium">
            Sistema de detección de copas de árboles usando YOLOv8
          </p>
          <p className="text-green-200 text-lg">
            Análisis automático de imágenes aéreas con inteligencia artificial
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section Mejorada */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Species Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <SpeciesChart data={stats?.species_distribution} />
        </div>

        {/* Confidence Stats Mejorado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            Confianza de Detección
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-semibold text-lg">Promedio</span>
                  <p className="text-sm text-gray-500 mt-1">Confianza media de todas las detecciones</p>
                </div>
                <span className="text-3xl font-bold text-green-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  {stats?.confidence_stats?.avg_confidence?.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-semibold text-lg">Máximo</span>
                  <p className="text-sm text-gray-500 mt-1">Mayor confianza registrada</p>
                </div>
                <span className="text-3xl font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  {stats?.confidence_stats?.max_confidence?.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-semibold text-lg">Mínimo</span>
                  <p className="text-sm text-gray-500 mt-1">Menor confianza registrada</p>
                </div>
                <span className="text-3xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  {stats?.confidence_stats?.min_confidence?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section Mejorada */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Sobre el Proyecto</h3>
            <p className="text-blue-100 leading-relaxed text-lg">
              Este sistema utiliza YOLOv8 para detectar automáticamente copas de árboles
              en imágenes aéreas. Los datos incluyen geolocalización GPS, especies catalogadas
              y métricas de confianza de cada detección, proporcionando análisis precisos
              para estudios forestales y ambientales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;