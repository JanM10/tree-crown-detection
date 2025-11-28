// frontend/src/services/api.js
import axios from 'axios';

// URL de tu API en Render (CAMBIAR POR TU URL REAL)
// const API_BASE_URL = 'http://localhost:5000'; // ← Local
const API_BASE_URL = 'https://tree-detection-api-tr4w.onrender.com'; // ← Render


// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos (primera petición puede tardar en Render)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - La API puede estar despertando (plan Free de Render)');
    }
    return Promise.reject(error);
  }
);

// ============================================
// FUNCIONES DE LA API
// ============================================

/**
 * Obtener información general de la API
 */
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error getting API info:', error);
    throw error;
  }
};

/**
 * Obtener todas las especies
 */
export const getSpecies = async () => {
  try {
    const response = await api.get('/api/species');
    return response.data;
  } catch (error) {
    console.error('Error getting species:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas generales
 */
export const getStats = async () => {
  try {
    const response = await api.get('/api/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

/**
 * Obtener árboles con paginación
 * @param {number} page - Número de página
 * @param {number} perPage - Árboles por página
 */
export const getTrees = async (page = 1, perPage = 50) => {
  try {
    const response = await api.get('/api/trees', {
      params: { page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting trees:', error);
    throw error;
  }
};

/**
 * Obtener un árbol específico por ID
 * @param {number} treeId - ID del árbol
 */
export const getTreeById = async (treeId) => {
  try {
    const response = await api.get(`/api/trees/${treeId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting tree:', error);
    throw error;
  }
};

/**
 * Obtener árboles por especie
 * @param {number} speciesId - ID de la especie
 * @param {number} page - Número de página
 * @param {number} perPage - Árboles por página
 */
export const getTreesBySpecies = async (speciesId, page = 1, perPage = 50) => {
  try {
    const response = await api.get(`/api/trees/species/${speciesId}`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting trees by species:', error);
    throw error;
  }
};

/**
 * Obtener todas las imágenes procesadas
 */
export const getImages = async () => {
  try {
    const response = await api.get('/api/images');
    return response.data;
  } catch (error) {
    console.error('Error getting images:', error);
    throw error;
  }
};

/**
 * Obtener imagen en formato base64 (data URL)
 * @param {number} imageId - ID de la imagen
 */
export const getImageBase64 = async (imageId) => {
  try {
    const response = await api.get(`/api/images/${imageId}/base64`);
    return response.data;
  } catch (error) {
    console.error('Error getting image base64:', error);
    throw error;
  }
};

/**
 * Obtener detecciones de una imagen específica
 * @param {number} imageId - ID de la imagen
 */
export const getImageDetections = async (imageId) => {
  try {
    const response = await api.get(`/api/images/${imageId}/detections`);
    return response.data;
  } catch (error) {
    console.error('Error getting image detections:', error);
    throw error;
  }
};

/**
 * Obtener imagen original como archivo (para descarga)
 * @param {number} imageId - ID de la imagen
 */
export const getImageFile = async (imageId) => {
  try {
    const response = await api.get(`/api/images/${imageId}`, {
      responseType: 'blob' // Importante para archivos binarios
    });
    return response.data;
  } catch (error) {
    console.error('Error getting image file:', error);
    throw error;
  }
};

/**
 * Obtener imágenes filtradas por especie
 * @param {number} speciesId - ID de la especie
 */
export const getImagesBySpecies = async (speciesId) => {
  try {
    const response = await api.get(`/api/images/species/${speciesId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting images by species:', error);
    throw error;
  }
};

/**
 * Buscar árboles en un área GPS
 * @param {Object} bounds - { lat_min, lat_max, lon_min, lon_max }
 */
export const getTreesInArea = async (bounds) => {
  try {
    const response = await api.get('/api/trees/area', {
      params: bounds
    });
    return response.data;
  } catch (error) {
    console.error('Error getting trees in area:', error);
    throw error;
  }
};

// ============================================
// FUNCIONES DE UTILIDAD PARA IMÁGENES
// ============================================

/**
 * Descargar una imagen
 * @param {number} imageId - ID de la imagen
 * @param {string} filename - Nombre del archivo
 */
export const downloadImage = async (imageId, filename = 'image.jpg') => {
  try {
    const blob = await getImageFile(imageId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

/**
 * Función para probar la conexión con la API
 */
export const testConnection = async () => {
  try {
    const response = await api.get('/api/info');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Exportar la instancia de axios por si se necesita
export default api;