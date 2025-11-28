// frontend/src/components/StatsCards.jsx
import { Trees, Image, Leaf, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total de Árboles',
      value: stats.total_trees?.toLocaleString() || '0',
      icon: Trees,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Árboles detectados',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    {
      title: 'Imágenes Procesadas',
      value: stats.total_images || '0',
      icon: Image,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Imágenes analizadas',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Especies',
      value: stats.species_distribution?.length || '0',
      icon: Leaf,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      description: 'Especies catalogadas',
      gradient: 'bg-gradient-to-br from-teal-500 to-teal-600'
    },
    {
      title: 'Promedio/Imagen',
      value: stats.average_trees_per_image?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'Árboles por imagen',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group relative overflow-hidden"
          >
            {/* Efecto de gradiente sutil en hover */}
            <div className={`absolute inset-0 ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-full ${card.bgColor} ${card.textColor} border ${card.borderColor}`}>
                  LIVE
                </div>
              </div>
              
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">
                {card.title}
              </h3>
              
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {card.value}
              </p>
              
              <p className="text-sm text-gray-500 font-medium">{card.description}</p>
              
              {/* Línea decorativa con gradiente */}
              <div className={`mt-4 h-1 w-12 rounded-full ${card.gradient}`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;