// frontend/src/components/SpeciesChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

const SpeciesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Distribución por Especie
        </h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const chartData = data.map(species => ({
    name: species.common_name,
    value: species.count,
    confidence: species.avg_confidence
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Distribución por Especie
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={140}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} árboles (${props.payload.confidence?.toFixed(1)}% confianza)`,
              name
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeciesChart;