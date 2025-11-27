// frontend/src/components/Loading.jsx
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center max-w-md">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <p className="text-gray-700 text-lg font-semibold mb-2">{message}</p>
        <p className="text-sm text-gray-500">
          La primera carga puede tardar ~30 segundos
        </p>
        
        {/* Loading animation */}
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;