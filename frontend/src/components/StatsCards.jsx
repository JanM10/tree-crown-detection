// frontend/src/components/StatsCards.jsx
import { Trees, Image, Leaf, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total de Árboles',
      value: stats.total_trees?.toLocaleString() || '0',
      icon: Trees,
      color: 'bg-green-500',
      description: 'Árboles detectados'
    },
    {
      title: 'Imágenes Procesadas',
      value: stats.total_images || '0',
      icon: Image,
      color: 'bg-blue-500',
      description: 'Imágenes analizadas'
    },
    {
      title: 'Especies',
      value: stats.species_distribution?.length || '0',
      icon: Leaf,
      color: 'bg-purple-500',
      description: 'Especies catalogadas'
    },
    {
      title: 'Promedio/Imagen',
      value: stats.average_trees_per_image?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'bg-orange-500',
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
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </p>
            <p className="text-sm text-gray-500">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;