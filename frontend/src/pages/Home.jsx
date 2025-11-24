// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import StatsCards from '../components/StatsCards';
import SpeciesChart from '../components/SpeciesChart';
import Loading from '../components/Loading';
import { AlertCircle } from 'lucide-react';

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
        setError('Error al cargar estadisticas');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando estadisticas..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Error de Conexion</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Tree Crown Detection
        </h1>
        <p className="text-xl text-green-100 mb-2">
          Sistema de deteccion de copas de arboles usando YOLOv8
        </p>
        <p className="text-green-200">
          Analisis automatico de imagenes aereas con inteligencia artificial
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Species Distribution */}
        <SpeciesChart data={stats?.species_distribution} />

        {/* Confidence Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Confianza de Deteccion
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Promedio</span>
              <span className="text-2xl font-bold text-green-600">
                {stats?.confidence_stats?.avg_confidence?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Maximo</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.confidence_stats?.max_confidence?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Minimo</span>
              <span className="text-2xl font-bold text-orange-600">
                {stats?.confidence_stats?.min_confidence?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Sobre el Proyecto
        </h3>
        <p className="text-blue-800">
          Este sistema utiliza YOLOv8 para detectar automaticamente copas de arboles
          en imagenes aereas. Los datos incluyen geolocalizacion GPS, especies catalogadas
          y metricas de confianza de cada deteccion.
        </p>
      </div>
    </div>
  );
};

export default Home;
