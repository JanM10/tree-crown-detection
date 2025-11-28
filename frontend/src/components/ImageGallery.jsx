// frontend/src/components/ImageGallery.jsx
import { useState, useEffect } from "react";
import { getImages, getImageBase64, getImageDetections } from "../services/api";
import Loading from "./Loading";
import {
  Search,
  Filter,
  Image as ImageIcon,
  Trees,
  Map,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        setError("Error al cargar imágenes");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((image) =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const navigateImages = (direction) => {
    if (direction === "next" && currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    } else if (direction === "prev" && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  };

  if (loading) {
    return <Loading message="Cargando galería de imágenes..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de la Galería */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Galería de Imágenes
            </h2>
            <p className="text-gray-600 mt-1">
              {images.length} imágenes procesadas •{" "}
              {images.reduce((sum, img) => sum + img.total_trees_detected, 0)}{" "}
              árboles detectados
            </p>
          </div>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full md:w-80 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Grid de Imágenes */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron imágenes
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "No hay imágenes disponibles"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <ImageCard
              key={image.image_id}
              image={image}
              onSelect={() => openImageModal(image, index)}
            />
          ))}
        </div>
      )}

      {/* Modal de Imagen */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          currentIndex={currentImageIndex}
          totalImages={filteredImages.length}
          onClose={closeImageModal}
          onNavigate={navigateImages}
        />
      )}
    </div>
  );
};

// Componente de Tarjeta de Imagen Individual
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
      console.error("Error loading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group overflow-hidden"
      onClick={onSelect}
    >
      {/* Container de Imagen */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
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

        {/* Overlay de Información */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-semibold truncate text-white">
              {image.filename}
            </span>
            <div className="flex items-center space-x-1 bg-emerald-600 px-2 py-1 rounded-full text-xs">
              <Trees className="w-3 h-3" />
              <span>{image.total_trees_detected}</span>
            </div>
          </div>
        </div>

        {/* Efecto de Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      {/* Información de la Imagen */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">ID: {image.image_id}</span>
          <span className="text-gray-500">
            {new Date(image.processing_date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          {image.total_trees_detected} árboles detectados •
          {image.image_size
            ? ` ${Math.round(image.image_size / 1024)}KB`
            : " Tamaño no disponible"}
        </p>

        {/* Badge de GPS si está disponible */}
        {image.gps_center_lat && image.gps_center_lon && (
          <div className="flex items-center space-x-1 mt-2 text-xs text-blue-600">
            <Map className="w-3 h-3" />
            <span>GPS Disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal para Vista Detallada
const ImageModal = ({
  image,
  currentIndex,
  totalImages,
  onClose,
  onNavigate,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [detectionsLoading, setDetectionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("image");

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

      // Cargar detecciones
      setDetectionsLoading(true);
      const detectionsResponse = await getImageDetections(image.image_id);
      if (detectionsResponse.success) {
        setDetections(detectionsResponse.data);
      }
    } catch (error) {
      console.error("Error loading image data:", error);
    } finally {
      setDetectionsLoading(false);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = image.filename || `image-${image.image_id}.jpg`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 truncate">
              {image.filename}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {image.total_trees_detected} árboles detectados •{" "}
              {new Date(image.processing_date).toLocaleDateString()}
            </p>
          </div>

          {/* Controles de Navegación */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} / {totalImages}
              </span>
            </div>

            <button
              onClick={() => onNavigate("prev")}
              disabled={currentIndex === 0}
              className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => onNavigate("next")}
              disabled={currentIndex === totalImages - 1}
              className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={downloadImage}
              className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
              title="Descargar imagen"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel de Imagen */}
          <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-0">
            {imageUrl ? (
              <div className="relative max-w-full max-h-full">
                <img
                  src={imageUrl}
                  alt={image.filename}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            ) : (
              <div className="text-gray-400 flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                <span>Cargando imagen...</span>
              </div>
            )}
          </div>

          {/* Panel de Información */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Pestañas */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex-1 py-3 text-center font-medium transition-colors duration-200 ${
                    activeTab === "info"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Información
                </button>
                <button
                  onClick={() => setActiveTab("detections")}
                  className={`flex-1 py-3 text-center font-medium transition-colors duration-200 ${
                    activeTab === "detections"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Detecciones
                </button>
              </div>

              {/* Contenido de Pestañas */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Información Básica */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-semibold text-emerald-800 mb-3 text-lg">
                      Información de la Imagen
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700 font-medium">
                          ID:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {image.image_id}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700 font-medium">
                          Árboles detectados:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {image.total_trees_detected}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700 font-medium">
                          Fecha de procesamiento:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {new Date(image.processing_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GPS Info */}
                  {image.gps_center_lat && image.gps_center_lon && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 text-lg">
                        Ubicación GPS
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700 font-medium">
                            Latitud:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {image.gps_center_lat?.toFixed(6)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700 font-medium">
                            Longitud:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {image.gps_center_lon?.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "detections" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    Detecciones ({detections.length})
                  </h4>

                  {detectionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">
                        Cargando detecciones...
                      </p>
                    </div>
                  ) : detections.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {detections.map((detection, index) => (
                        <div
                          key={detection.tree_id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900">
                              Árbol #{detection.tree_id}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                              {(detection.detection_confidence * 100).toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Especie:</span>
                              <span className="font-medium">
                                {detection.species_name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Altura estimada:</span>
                              <span className="font-medium">
                                {detection.estimated_height_m?.toFixed(1)}m
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay detecciones disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
