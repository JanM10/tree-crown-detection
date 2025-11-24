// frontend/src/services/api.js
import axios from 'axios';

// URL de tu API en Render (CAMBIAR POR TU URL REAL)
const API_BASE_URL = 'https://tree-detection-api-tr4w.onrender.com';

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

// Exportar la instancia de axios por si se necesita
export default api;