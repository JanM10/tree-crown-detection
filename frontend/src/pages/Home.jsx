// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import StatsCards from '../components/StatsCards';
import SpeciesChart from '../components/SpeciesChart';
import Loading from '../components/Loading';
import { AlertCircle, RefreshCw, Leaf, Map, Database, Cpu } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8 w-full">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', paddingTop: '1rem' }}>
      {/* Hero Section */}
      <div 
        className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
        style={{ width: '100%' }}
      >
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Tree Crown Detection
          </h1>
          <p className="text-xl text-emerald-100 mb-4 font-light mx-auto leading-relaxed">
            Sistema avanzado de detección de copas de árboles utilizando inteligencia artificial YOLOv8
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 w-full">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Cpu className="w-4 h-4" />
              <span className="text-sm">YOLOv8 AI</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Map className="w-4 h-4" />
              <span className="text-sm">Geolocalización GPS</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Database className="w-4 h-4" />
              <span className="text-sm">Análisis en Tiempo Real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div style={{ width: '100%', marginTop: '2rem' }}>
        <StatsCards stats={stats} />
      </div>

      {/* Charts & Analytics Section */}
      <div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        style={{ width: '100%', marginTop: '2rem' }}
      >
        {/* Species Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 w-full">
          <div className="flex items-center space-x-3 mb-6 w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900">Distribución por Especie</h2>
              <p className="text-gray-600 text-sm">Clasificación de árboles detectados</p>
            </div>
          </div>
          <SpeciesChart data={stats?.species_distribution} />
        </div>

        {/* Confidence Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 w-full">
          <div className="flex items-center space-x-3 mb-6 w-full">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900">Confianza de Detección</h2>
              <p className="text-gray-600 text-sm">Métricas de precisión del modelo</p>
            </div>
          </div>
          
          <div className="space-y-4 w-full">
            {/* Average Confidence */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 group w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <span className="text-gray-700 font-semibold text-lg block">Promedio</span>
                  <p className="text-sm text-gray-500 mt-1">Confianza media de detección</p>
                </div>
                <div className="relative">
                  <span className="text-3xl font-bold text-emerald-600 bg-white px-4 py-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {stats?.confidence_stats?.avg_confidence?.toFixed(1)}%
                  </span>
                  <div className="absolute -inset-1 bg-emerald-200 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                </div>
              </div>
            </div>
            
            {/* Max Confidence */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 group w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <span className="text-gray-700 font-semibold text-lg block">Máximo</span>
                  <p className="text-sm text-gray-500 mt-1">Mayor confianza registrada</p>
                </div>
                <div className="relative">
                  <span className="text-3xl font-bold text-blue-600 bg-white px-4 py-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {stats?.confidence_stats?.max_confidence?.toFixed(1)}%
                  </span>
                  <div className="absolute -inset-1 bg-blue-200 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                </div>
              </div>
            </div>
            
            {/* Min Confidence */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 group w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <span className="text-gray-700 font-semibold text-lg block">Mínimo</span>
                  <p className="text-sm text-gray-500 mt-1">Menor confianza registrada</p>
                </div>
                <div className="relative">
                  <span className="text-3xl font-bold text-amber-600 bg-white px-4 py-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {stats?.confidence_stats?.min_confidence?.toFixed(1)}%
                  </span>
                  <div className="absolute -inset-1 bg-amber-200 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div 
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
        style={{ width: '100%', marginTop: '2rem' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 w-full">
            <div className="flex-1 w-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="w-full">
                  <h3 className="text-3xl font-bold mb-2">Sobre el Proyecto</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                Este sistema utiliza <span className="text-emerald-300 font-semibold">YOLOv8</span> para detectar automáticamente 
                copas de árboles en imágenes aéreas. Los datos incluyen <span className="text-emerald-300 font-semibold">geolocalización GPS</span>, 
                especies catalogadas y métricas de confianza de cada detección, proporcionando análisis precisos 
                para estudios forestales y ambientales con tecnología de vanguardia.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[280px] w-full lg:w-auto">
              <h4 className="font-semibold text-white mb-4 text-lg">Características Principales</h4>
              <ul className="space-y-3 text-slate-200">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Detección en tiempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Geolocalización precisa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Múltiples especies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Análisis estadístico</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;