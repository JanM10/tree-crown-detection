# src/api/routes.py
from flask import Blueprint, request, jsonify
from .database import DatabaseManager

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
    """GET /api/images - Retorna todas las imagenes procesadas."""
    try:
        images = db.images.get_all_images()
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
