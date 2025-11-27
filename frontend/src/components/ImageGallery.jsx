// frontend/src/components/ImageGallery.jsx
import { useState, useEffect } from 'react';
import { getImages, getImageBase64 } from '../services/api';
import Loading from './Loading';
import { Search, Filter, Image as ImageIcon, Trees } from 'lucide-react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await getImages();
      
      if (response.success) {
        setImages(response.data);
      } else {
        setError('Error al cargar imágenes');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading message="Cargando galería de imágenes..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Galería de Imágenes</h2>
            <p className="text-gray-600 mt-1">
              {images.length} imágenes procesadas • {images.reduce((sum, img) => sum + img.total_trees_detected, 0)} árboles detectados
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron imágenes
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay imágenes disponibles'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <ImageCard 
              key={image.image_id} 
              image={image} 
              onSelect={setSelectedImage}
            />
          ))}
        </div>
      )}

      {/* Modal para imagen seleccionada */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

// Componente de tarjeta de imagen individual
const ImageCard = ({ image, onSelect }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImage();
  }, [image.image_id]);

  const loadImage = async () => {
    try {
      const response = await getImageBase64(image.image_id);
      if (response.success) {
        setImageUrl(response.data);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
      onClick={() => onSelect(image)}
    >
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={image.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-semibold truncate">
              {image.filename}
            </span>
            <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded-full text-xs">
              <Trees className="w-3 h-3" />
              <span>{image.total_trees_detected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>ID: {image.image_id}</span>
          <span>{new Date(image.processing_date).toLocaleDateString()}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          {image.total_trees_detected} árboles detectados • {image.image_size ? `${Math.round(image.image_size / 1024)}KB` : 'Tamaño no disponible'}
        </p>
      </div>
    </div>
  );
};

// Modal para vista detallada
const ImageModal = ({ image, onClose }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [activeTab, setActiveTab] = useState('image');

  useEffect(() => {
    loadImageData();
  }, [image.image_id]);

  const loadImageData = async () => {
    try {
      // Cargar imagen
      const imgResponse = await getImageBase64(image.image_id);
      if (imgResponse.success) {
        setImageUrl(imgResponse.data);
      }

      // Cargar detecciones (necesitarías crear este endpoint)
      // const detectionsResponse = await getImageDetections(image.image_id);
      // if (detectionsResponse.success) {
      //   setDetections(detectionsResponse.data);
      // }
    } catch (error) {
      console.error('Error loading image data:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{image.filename}</h3>
            <p className="text-gray-600 text-sm">
              {image.total_trees_detected} árboles detectados • {new Date(image.processing_date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Image Panel */}
          <div className="lg:w-2/3 p-6 bg-gray-50 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={image.filename}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-gray-400">Cargando imagen...</div>
            )}
          </div>

          {/* Info Panel */}
          <div className="lg:w-1/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Información de la Imagen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">ID:</span>
                    <span className="font-medium">{image.image_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Árboles detectados:</span>
                    <span className="font-medium">{image.total_trees_detected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Fecha de procesamiento:</span>
                    <span className="font-medium">{new Date(image.processing_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* GPS Info */}
              {image.gps_center_lat && image.gps_center_lon && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Ubicación GPS</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Latitud:</span>
                      <span className="font-medium">{image.gps_center_lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Longitud:</span>
                      <span className="font-medium">{image.gps_center_lon.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold">
                  Ver Detecciones
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                  Descargar Imagen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;