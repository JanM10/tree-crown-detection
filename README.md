## Versión 3.0 - Flask REST API

### Características:
- **API REST** completa para gestión de detecciones
- **8 endpoints** para árboles, especies, imágenes y estadísticas
- **Base de datos SQLite** con estructura optimizada
- **Arquitectura modular** y profesional

### Endpoints principales:
- `GET /api/stats` - Estadísticas generales
- `GET /api/trees` - Árboles detectados (con paginación)
- `GET /api/species` - Especies de árboles
- `GET /api/trees/area` - Búsqueda por coordenadas GPS

### Ejemplo de uso:
```bash
# Obtener estadísticas
curl http://localhost:5000/api/stats

# Obtener primeros 10 árboles
curl "http://localhost:5000/api/trees?page=1&per_page=10"


## API en Producción

**URL de la API:** https://tree-detection-api-tr4w.onrender.com

### Endpoints disponibles:

- `GET /` - Información general
- `GET /api/info` - [Lista de todos los endpoints](https://tree-detection-api-tr4w.onrender.com/api/info)
- `GET /api/species` - [Ver especies](https://tree-detection-api-tr4w.onrender.com/api/species)
- `GET /api/stats` - [Estadísticas](https://tree-detection-api-tr4w.onrender.com/api/stats)
- `GET /api/trees` - [Árboles detectados](https://tree-detection-api-tr4w.onrender.com/api/trees?page=1&per_page=10)
- `GET /api/images` - Lista de imágenes procesadas

### Ejemplo de uso:
```bash
curl https://tree-detection-api-tr4w.onrender.com/api/stats
```

**Nota:** La primera petición puede tardar ~30 segundos (plan gratuito de Render).