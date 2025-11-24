// frontend/src/components/Loading.jsx
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      <p className="text-gray-600 text-lg">{message}</p>
      <p className="text-sm text-gray-400">
        La primera carga puede tardar ~30 segundos
      </p>
    </div>
  );
};

export default Loading;