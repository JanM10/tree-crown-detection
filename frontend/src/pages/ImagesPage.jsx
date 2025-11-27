// frontend/src/pages/ImagesPage.jsx
import ImageGallery from '../components/ImageGallery';

const ImagesPage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section para Imágenes */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Galería de Imágenes
          </h1>
          <p className="text-xl text-blue-100 mb-2 font-medium">
            Explora todas las imágenes procesadas por el sistema
          </p>
          <p className="text-blue-200 text-lg">
            Visualiza detecciones, metadatos y información geográfica
          </p>
        </div>
      </div>

      {/* Galería */}
      <ImageGallery />
    </div>
  );
};

export default ImagesPage;