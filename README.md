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