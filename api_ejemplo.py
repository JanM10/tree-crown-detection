"""
Flask API para Tree Detection
Consulta base de datos SQLite con detecciones de árboles
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Permitir requests desde cualquier origen

# Ruta de la base de datos
DB_PATH = os.path.join(os.path.dirname(__file__), 'tree_detection.db')

def get_db_connection():
    """Crear conexión a la base de datos"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Retornar filas como diccionarios
    return conn

def query_to_dict(rows):
    """Convertir resultado de query a lista de diccionarios"""
    return [dict(row) for row in rows]

# ============================================
# ENDPOINT: Página de inicio
# ============================================
@app.route('/')
def home():
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

# ============================================
# ENDPOINT: Obtener todas las especies
# ============================================
@app.route('/api/species', methods=['GET'])
def get_species():
    """GET /api/species - Retorna todas las especies"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                s.species_id,
                s.common_name,
                s.scientific_name,
                s.average_height_m,
                s.crown_diameter_m,
                s.description,
                COUNT(t.tree_id) as tree_count
            FROM species s
            LEFT JOIN trees t ON s.species_id = t.species_id
            GROUP BY s.species_id
        """)
        
        species = query_to_dict(cursor.fetchall())
        conn.close()
        
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
# ENDPOINT: Obtener todos los árboles (con paginación)
# ============================================
@app.route('/api/trees', methods=['GET'])
def get_trees():
    """GET /api/trees?page=1&per_page=50 - Retorna árboles con paginación"""
    try:
        # Parámetros de paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        offset = (page - 1) * per_page
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Contar total
        cursor.execute("SELECT COUNT(*) as total FROM trees")
        total = cursor.fetchone()['total']
        
        # Obtener árboles
        cursor.execute("""
            SELECT 
                tree_id,
                species_name,
                gps_lat,
                gps_lon,
                detection_confidence,
                estimated_height_m,
                source_image
            FROM trees_full_info
            ORDER BY tree_id
            LIMIT ? OFFSET ?
        """, (per_page, offset))
        
        trees = query_to_dict(cursor.fetchall())
        conn.close()
        
        return jsonify({
            "success": True,
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": (total + per_page - 1) // per_page,
            "count": len(trees),
            "data": trees
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# ENDPOINT: Obtener árbol por ID
# ============================================
@app.route('/api/trees/<int:tree_id>', methods=['GET'])
def get_tree_by_id(tree_id):
    """GET /api/trees/{id} - Retorna un árbol específico"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                t.tree_id,
                t.image_id,
                t.species_id,
                s.common_name as species_name,
                s.scientific_name,
                t.bbox_x_center,
                t.bbox_y_center,
                t.bbox_width,
                t.bbox_height,
                t.gps_lat,
                t.gps_lon,
                t.detection_confidence,
                t.estimated_height_m,
                t.estimated_crown_diameter_m,
                t.detection_date,
                i.filename as source_image
            FROM trees t
            JOIN species s ON t.species_id = s.species_id
            JOIN images i ON t.image_id = i.image_id
            WHERE t.tree_id = ?
        """, (tree_id,))
        
        tree = cursor.fetchone()
        conn.close()
        
        if tree:
            return jsonify({
                "success": True,
                "data": dict(tree)
            })
        else:
            return jsonify({
                "success": False,
                "error": "Árbol no encontrado"
            }), 404
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# ENDPOINT: Obtener árboles por especie
# ============================================
@app.route('/api/trees/species/<int:species_id>', methods=['GET'])
def get_trees_by_species(species_id):
    """GET /api/trees/species/{id} - Retorna árboles de una especie"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        offset = (page - 1) * per_page
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Contar total
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM trees 
            WHERE species_id = ?
        """, (species_id,))
        total = cursor.fetchone()['total']
        
        # Obtener árboles
        cursor.execute("""
            SELECT 
                tree_id,
                species_name,
                scientific_name,
                gps_lat,
                gps_lon,
                detection_confidence,
                estimated_height_m,
                source_image
            FROM trees_full_info
            WHERE species_id = ?
            ORDER BY tree_id
            LIMIT ? OFFSET ?
        """, (species_id, per_page, offset))
        
        trees = query_to_dict(cursor.fetchall())
        conn.close()
        
        return jsonify({
            "success": True,
            "species_id": species_id,
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": (total + per_page - 1) // per_page,
            "count": len(trees),
            "data": trees
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# ENDPOINT: Obtener imágenes
# ============================================
@app.route('/api/images', methods=['GET'])
def get_images():
    """GET /api/images - Retorna todas las imágenes procesadas"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                image_id,
                filename,
                gps_center_lat,
                gps_center_lon,
                total_trees_detected,
                coverage_area_m2,
                processing_date
            FROM images
            ORDER BY total_trees_detected DESC
        """)
        
        images = query_to_dict(cursor.fetchall())
        conn.close()
        
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
# ENDPOINT: Estadísticas generales
# ============================================
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """GET /api/stats - Retorna estadísticas generales"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total de árboles
        cursor.execute("SELECT COUNT(*) as total FROM trees")
        total_trees = cursor.fetchone()['total']
        
        # Total de imágenes
        cursor.execute("SELECT COUNT(*) as total FROM images")
        total_images = cursor.fetchone()['total']
        
        # Árboles por especie
        cursor.execute("""
            SELECT 
                s.common_name,
                COUNT(t.tree_id) as count,
                ROUND(AVG(t.detection_confidence) * 100, 2) as avg_confidence
            FROM species s
            LEFT JOIN trees t ON s.species_id = t.species_id
            GROUP BY s.species_id
            ORDER BY count DESC
        """)
        species_distribution = query_to_dict(cursor.fetchall())
        
        # Confianza promedio general
        cursor.execute("""
            SELECT 
                ROUND(AVG(detection_confidence) * 100, 2) as avg_confidence,
                ROUND(MIN(detection_confidence) * 100, 2) as min_confidence,
                ROUND(MAX(detection_confidence) * 100, 2) as max_confidence
            FROM trees
        """)
        confidence_stats = dict(cursor.fetchone())
        
        conn.close()
        
        return jsonify({
            "success": True,
            "data": {
                "total_trees": total_trees,
                "total_images": total_images,
                "average_trees_per_image": round(total_trees / total_images, 1) if total_images > 0 else 0,
                "species_distribution": species_distribution,
                "confidence_stats": confidence_stats
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# ENDPOINT: Buscar árboles en área GPS
# ============================================
@app.route('/api/trees/area', methods=['GET'])
def get_trees_in_area():
    """
    GET /api/trees/area?lat_min=9.93&lat_max=9.94&lon_min=-84.09&lon_max=-84.08
    Retorna árboles en un área GPS específica
    """
    try:
        lat_min = request.args.get('lat_min', type=float)
        lat_max = request.args.get('lat_max', type=float)
        lon_min = request.args.get('lon_min', type=float)
        lon_max = request.args.get('lon_max', type=float)
        
        if not all([lat_min, lat_max, lon_min, lon_max]):
            return jsonify({
                "success": False,
                "error": "Parámetros requeridos: lat_min, lat_max, lon_min, lon_max"
            }), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                tree_id,
                species_name,
                gps_lat,
                gps_lon,
                detection_confidence,
                estimated_height_m,
                source_image
            FROM trees_full_info
            WHERE gps_lat BETWEEN ? AND ?
              AND gps_lon BETWEEN ? AND ?
            ORDER BY tree_id
        """, (lat_min, lat_max, lon_min, lon_max))
        
        trees = query_to_dict(cursor.fetchall())
        conn.close()
        
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
# Manejo de errores
# ============================================
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint no encontrado"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Error interno del servidor"
    }), 500

# ============================================
# Ejecutar la aplicación
# ============================================
if __name__ == '__main__':
    # Verificar que la base de datos existe
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: No se encontró tree_detection.db en {DB_PATH}")
        exit(1)
    
    print(f"✅ Base de datos encontrada: {DB_PATH}")
    print(f"🚀 Iniciando API en http://localhost:5000")
    
    # Modo desarrollo (cambiar a False en producción)
    app.run(debug=True, host='0.0.0.0', port=5000)