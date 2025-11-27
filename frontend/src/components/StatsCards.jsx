// frontend/src/components/StatsCards.jsx
import { Trees, Image, Leaf, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total de Árboles',
      value: stats.total_trees?.toLocaleString() || '0',
      icon: Trees,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Árboles detectados'
    },
    {
      title: 'Imágenes Procesadas',
      value: stats.total_images || '0',
      icon: Image,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Imágenes analizadas'
    },
    {
      title: 'Especies',
      value: stats.species_distribution?.length || '0',
      icon: Leaf,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Especies catalogadas'
    },
    {
      title: 'Promedio/Imagen',
      value: stats.average_trees_per_image?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      description: 'Árboles por imagen'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${card.bgColor} ${card.textColor}`}>
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
            
            {/* Línea decorativa */}
            <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${card.color}`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;