// frontend/src/pages/ImagesPage.jsx
import ImageGallery from '../components/ImageGallery';
import { Camera, Search, Filter } from 'lucide-react';

const ImagesPage = () => {
  return (
    <div className="space-y-8 w-full pt-6">
      <div className="space-y-8 w-full">
        {/* Hero Section para Imágenes */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Galería de Imágenes
            </h1>
            
            {/* Textos CENTRADOS con el MISMO ancho máximo */}
            <div className="space-y-3 mb-6">
              <p className="text-xl text-blue-100 font-light  mx-auto leading-relaxed">
                Explora todas las imágenes procesadas por el sistema de detección
              </p>
              <p className="text-lg text-blue-200  mx-auto leading-relaxed"> {/* Cambiado a max-w-3xl */}
                Visualiza detecciones, metadatos e información geográfica de cada análisis
              </p>
            </div>
            
            {/* Stats Preview */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Camera className="w-4 h-4" />
                <span className="text-sm">+18 imágenes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Search className="w-4 h-4" />
                <span className="text-sm">+1700 detecciones</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Búsqueda avanzada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Galería */}
        <div className="px-0">
          <ImageGallery />
        </div>
      </div>
    </div>
  );
};

export default ImagesPage;