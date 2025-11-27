# src/api/routes.py
from flask import Blueprint, request, jsonify, send_file
from .database import DatabaseManager
import base64
import io

# Crear Blueprint para las rutas del API
api_bp = Blueprint('api', __name__)
db = DatabaseManager()

# ============================================
# ENDPOINTS DE ESPECIES
# ============================================

@api_bp.route('/species', methods=['GET'])
def get_species():
    """GET /api/species - Retorna todas las especies."""
    try:
        species = db.species.get_all_species() 
        return jsonify({
            "success": True,
            "count": len(species),
            "data": species
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINTS DE ARBOLES
# ============================================

@api_bp.route('/trees', methods=['GET'])
def get_trees():
    """GET /api/trees?page=1&per_page=50 - Retorna arboles con paginacion."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Validar parametros
        if page < 1 or per_page < 1 or per_page > 100:
            return jsonify({
                "success": False,
                "error": "Parametros invalidos: page >= 1, 1 <= per_page <= 100"
            }), 400
        
        result = db.trees.get_trees_paginated(page=page, per_page=per_page)  
        
        return jsonify({
            "success": True,
            "page": result["page"],
            "per_page": result["per_page"],
            "total": result["total"],
            "total_pages": result["total_pages"],
            "count": len(result["trees"]),
            "data": result["trees"]
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/trees/<int:tree_id>', methods=['GET'])
def get_tree_by_id(tree_id):
    """GET /api/trees/{id} - Retorna un arbol especifico por ID."""
    try:
        tree = db.trees.get_tree_by_id(tree_id) 
        
        if tree:
            return jsonify({
                "success": True,
                "data": tree
            })
        else:
            return jsonify({
                "success": False,
                "error": f"Arbol con ID {tree_id} no encontrado."
            }), 404
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/trees/species/<int:species_id>', methods=['GET'])
def get_trees_by_species(species_id):
    """GET /api/trees/species/{id} - Retorna arboles de una especie."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Validar parametros
        if page < 1 or per_page < 1 or per_page > 100:
            return jsonify({
                "success": False,
                "error": "Parametros invalidos: page >= 1, 1 <= per_page <= 100"
            }), 400
        
        result = db.trees.get_trees_by_species(species_id, page=page, per_page=per_page) 
        
        return jsonify({
            "success": True,
            "species_id": species_id,
            "page": result["page"],
            "per_page": result["per_page"],
            "total": result["total"],
            "total_pages": result["total_pages"],
            "count": len(result["trees"]),
            "data": result["trees"]
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/trees/area', methods=['GET'])
def get_trees_in_area():
    """
    GET /api/trees/area?lat_min=9.93&lat_max=9.94&lon_min=-84.09&lon_max=-84.08
    Retorna los arboles dentro de un area geografica especifica.
    """
    try:
        lat_min = request.args.get('lat_min', type=float)
        lat_max = request.args.get('lat_max', type=float)
        lon_min = request.args.get('lon_min', type=float)
        lon_max = request.args.get('lon_max', type=float)
        
        # Validar parametros requeridos
        if not all([lat_min, lat_max, lon_min, lon_max]):
            return jsonify({
                "success": False,
                "error": "Parametros requeridos: lat_min, lat_max, lon_min, lon_max"
            }), 400
        
        # Validar rangos logicos
        if lat_min >= lat_max or lon_min >= lon_max:
            return jsonify({
                "success": False,
                "error": "Rangos invalidos: lat_min < lat_max y lon_min < lon_max"
            }), 400
        
        trees = db.trees.get_trees_in_area(lat_min, lat_max, lon_min, lon_max) 
        
        return jsonify({
            "success": True,
            "area": {
                "lat_min": lat_min,
                "lat_max": lat_max,
                "lon_min": lon_min,
                "lon_max": lon_max
            },
            "count": len(trees),
            "data": trees
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINTS DE IMAGENES
# ============================================

@api_bp.route('/images', methods=['GET'])
def get_images():
    """GET /api/images - Retorna todas las imágenes procesadas con metadatos."""
    try:
        images = db.images.get_all_images()
        
        # Agregar URLs a cada imagen
        for img in images:
            img['image_url'] = f"/api/images/{img['image_id']}"
            img['thumbnail_url'] = f"/api/images/{img['image_id']}/base64"
            img['detections_url'] = f"/api/images/{img['image_id']}/detections"
        
        return jsonify({
            "success": True,
            "count": len(images),
            "data": images
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINTS DE ESTADISTICAS
# ============================================

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """GET /api/stats - Retorna estadisticas generales."""
    try:
        stats = db.statistics.get_statistics()
        return jsonify({
            "success": True,
            "data": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    

# ============================================
# NUEVOS ENDPOINTS PARA IMÁGENES (BASE64)
# ============================================

@api_bp.route('/images/<int:image_id>', methods=['GET'])
def get_image_by_id(image_id):
    """GET /api/images/{id} - Retorna una imagen específica como JPEG."""
    try:
        # Obtener imagen de la base de datos
        query = """
            SELECT image_data_base64, filename 
            FROM images 
            WHERE image_id = ?
        """
        result = db.execute_query(query, (image_id,))  # ✅ Ahora funciona
        
        if not result or not result[0].get('image_data_base64'):
            return jsonify({
                "success": False,
                "error": f"Imagen con ID {image_id} no encontrada."
            }), 404
        
        image_data = result[0]['image_data_base64']
        filename = result[0]['filename']
        
        # Convertir base64 a bytes
        image_bytes = base64.b64decode(image_data)
        
        # Crear un objeto de archivo en memoria
        image_io = io.BytesIO(image_bytes)
        
        # Enviar como imagen JPEG
        return send_file(
            image_io,
            mimetype='image/jpeg',
            as_attachment=False,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/images/<int:image_id>/base64', methods=['GET'])
def get_image_base64(image_id):
    """GET /api/images/{id}/base64 - Retorna imagen como data URL."""
    try:
        query = """
            SELECT image_data_base64, filename 
            FROM images 
            WHERE image_id = ?
        """
        result = db.execute_query(query, (image_id,))
        
        if not result or not result[0].get('image_data_base64'):
            return jsonify({
                "success": False,
                "error": f"Imagen con ID {image_id} no encontrada."
            }), 404
        
        image_data = result[0]['image_data_base64']
        filename = result[0]['filename']
        
        # Crear data URL
        data_url = f"data:image/jpeg;base64,{image_data}"
        
        return jsonify({
            "success": True,
            "data": data_url,
            "filename": filename
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/images/<int:image_id>/detections', methods=['GET'])
def get_image_detections(image_id):
    """GET /api/images/{id}/detections - Retorna árboles detectados en una imagen."""
    try:
        query = """
            SELECT 
                t.tree_id,
                t.bbox_x_center,
                t.bbox_y_center,
                t.bbox_width,
                t.bbox_height,
                t.gps_lat,
                t.gps_lon,
                t.detection_confidence,
                t.estimated_height_m,
                t.estimated_crown_diameter_m,
                s.common_name as species_name,
                s.scientific_name
            FROM trees t
            JOIN species s ON t.species_id = s.species_id
            WHERE t.image_id = ?
            ORDER BY t.detection_confidence DESC
        """
        
        detections = db.execute_query(query, (image_id,)) 
        
        return jsonify({
            "success": True,
            "image_id": image_id,
            "count": len(detections),
            "data": detections
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/images/species/<int:species_id>', methods=['GET'])
def get_images_by_species(species_id):
    """GET /api/images/species/{id} - Retorna imágenes por especie."""
    try:
        query = """
            SELECT DISTINCT
                i.image_id,
                i.filename,
                i.total_trees_detected,
                i.processing_date,
                COUNT(t.tree_id) as species_count
            FROM images i
            JOIN trees t ON i.image_id = t.image_id
            WHERE t.species_id = ? AND i.image_data_base64 IS NOT NULL
            GROUP BY i.image_id
            ORDER BY species_count DESC
        """
        
        images = db.execute_query(query, (species_id,))  # ✅ Ahora funciona
        
        # Agregar URLs a cada imagen
        for img in images:
            img['image_url'] = f"/api/images/{img['image_id']}"
            img['thumbnail_url'] = f"/api/images/{img['image_id']}/base64"
        
        return jsonify({
            "success": True,
            "species_id": species_id,
            "count": len(images),
            "data": images
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT DE INFORMACION DEL API
# ============================================

@api_bp.route('/info', methods=['GET'])
def api_info():
    """GET /api/info - Informacion general del API."""
    return jsonify({
        "message": "Tree Detection API",
        "version": "1.0",
        "endpoints": {
            "especies": "/api/species",
            "todos_los_arboles": "/api/trees",
            "arboles_paginados": "/api/trees?page=1&per_page=50",
            "arbol_por_id": "/api/trees/{id}",
            "arboles_por_especie": "/api/trees/species/{species_id}",
            "imagenes": "/api/images",
            "estadisticas": "/api/stats",
            "buscar_area": "/api/trees/area?lat_min=9.93&lat_max=9.94&lon_min=-84.09&lon_max=-84.08"
        }
    })


##### TEMPORAL ####

# Prueba rápida - agrega esto temporalmente a routes.py para verificar
@api_bp.route('/test-images', methods=['GET'])
def test_images():
    """Endpoint de prueba para verificar que las imágenes están en la BD"""
    try:
        query = "SELECT image_id, filename, LENGTH(image_data_base64) as size FROM images LIMIT 5"
        results = db.execute_query(query)  # ✅ Ahora funciona
        return jsonify({
            "success": True,
            "test_results": results
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@api_bp.route('/test-db', methods=['GET'])
def test_database():
    """Endpoint para probar la conexión y estructura de la BD"""
    try:
        # Probar que tenemos imágenes con base64
        query = """
            SELECT 
                image_id,
                filename, 
                total_trees_detected,
                LENGTH(image_data_base64) as base64_size
            FROM images 
            WHERE image_data_base64 IS NOT NULL
            LIMIT 3
        """
        
        images = db.execute_query(query)  # ✅ Ahora funciona
        
        # Probar que tenemos árboles
        trees_count = db.trees.get_total_trees_count()  # ✅ Usar el query específico
        
        return jsonify({
            "success": True,
            "database_info": {
                "images_with_base64": len(images),
                "sample_images": images,
                "total_trees": trees_count
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Revisa la estructura de la base de datos"
        }), 500

@api_bp.route('/debug-image/<int:image_id>', methods=['GET'])
def debug_image(image_id):
    """Endpoint para debuguear una imagen específica"""
    try:
        query = """
            SELECT 
                image_id,
                filename,
                total_trees_detected,
                LENGTH(image_data_base64) as base64_length,
                SUBSTR(image_data_base64, 1, 100) as base64_preview
            FROM images 
            WHERE image_id = ?
        """
        
        result = db.execute_query(query, (image_id,))  # ✅ Ahora funciona
        
        if not result:
            return jsonify({
                "success": False,
                "error": f"Imagen {image_id} no encontrada"
            }), 404
        
        image_info = result[0]
        
        return jsonify({
            "success": True,
            "image_info": image_info,
            "base64_valid": bool(image_info.get('base64_length', 0) > 0),
            "note": "Si base64_length > 0, la imagen está guardada correctamente"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    

############## BORRAR DESPUES

@api_bp.route('/test-images-page', methods=['GET'])
def test_images_page():
    """Página HTML para probar la visualización de imágenes"""
    try:
        # Renderizar la página de prueba
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Prueba de Imágenes</title>
            <style>
                body { font-family: Arial; max-width: 1200px; margin: 0 auto; padding: 20px; }
                .image-container { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
                img { max-width: 100%; height: auto; }
            </style>
        </head>
        <body>
            <h1>Prueba de Visualización de Imágenes Base64</h1>
            <div id="images"></div>
            
            <script>
                async function loadImages() {
                    const response = await fetch('/api/images');
                    const data = await response.json();
                    
                    const container = document.getElementById('images');
                    
                    if (!data.success) {
                        container.innerHTML = '<p>Error: ' + data.error + '</p>';
                        return;
                    }
                    
                    if (data.count === 0) {
                        container.innerHTML = '<p>No hay imágenes en la base de datos.</p>';
                        return;
                    }
                    
                    data.data.forEach(async (image) => {
                        // Obtener la imagen en base64
                        const imgResponse = await fetch('/api/images/' + image.image_id + '/base64');
                        const imgData = await imgResponse.json();
                        
                        if (imgData.success) {
                            const div = document.createElement('div');
                            div.className = 'image-container';
                            div.innerHTML = `
                                <h3>${image.filename} (ID: ${image.image_id})</h3>
                                <p>Árboles detectados: ${image.total_trees_detected}</p>
                                <img src="${imgData.data}" alt="${image.filename}">
                            `;
                            container.appendChild(div);
                        }
                    });
                }
                
                loadImages();
            </script>
        </body>
        </html>
        """
    except Exception as e:
        return f"Error: {str(e)}"