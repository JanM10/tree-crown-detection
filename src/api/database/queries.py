# src/api/database/queries.py
from .connection import DatabaseConnection

class SpeciesQueries:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def get_all_species(self):
        """Obtener todas las especies con conteo de árboles"""
        query = """
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
        """
        return self.db.execute_query(query)

class TreeQueries:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def get_total_trees_count(self):
        """Obtener conteo total de árboles"""
        return self.db.execute_scalar("SELECT COUNT(*) FROM trees")

    def get_trees_paginated(self, page: int = 1, per_page: int = 50):
        """Obtener árboles con paginación"""
        offset = (page - 1) * per_page
        total = self.get_total_trees_count()
        
        query = """
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
        """
        trees = self.db.execute_query(query, (per_page, offset))
        
        return {
            "trees": trees,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }

    def get_tree_by_id(self, tree_id: int):
        """Obtener un árbol específico por ID"""
        query = """
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
        """
        results = self.db.execute_query(query, (tree_id,))
        return results[0] if results else None

    def get_trees_by_species(self, species_id: int, page: int = 1, per_page: int = 50):
        """Obtener árboles por especie con paginación"""
        offset = (page - 1) * per_page
        
        # Contar total para esta especie
        count_query = "SELECT COUNT(*) FROM trees WHERE species_id = ?"
        total = self.db.execute_scalar(count_query, (species_id,))
        
        # Obtener árboles
        query = """
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
        """
        trees = self.db.execute_query(query, (species_id, per_page, offset))
        
        return {
            "trees": trees,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
            "species_id": species_id
        }

    def get_trees_in_area(self, lat_min: float, lat_max: float, lon_min: float, lon_max: float):
        """Buscar árboles en un área GPS específica"""
        query = """
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
        """
        return self.db.execute_query(query, (lat_min, lat_max, lon_min, lon_max))

class ImageQueries:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def get_all_images(self):
        """Obtener todas las imágenes procesadas"""
        query = """
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
        """
        return self.db.execute_query(query)

class StatisticsQueries:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def get_statistics(self):
        """Obtener estadísticas generales"""
        # Totales
        total_trees = self.db.execute_scalar("SELECT COUNT(*) FROM trees")
        total_images = self.db.execute_scalar("SELECT COUNT(*) FROM images")
        
        # Distribución por especie
        species_query = """
            SELECT 
                s.common_name,
                COUNT(t.tree_id) as count,
                ROUND(AVG(t.detection_confidence) * 100, 2) as avg_confidence
            FROM species s
            LEFT JOIN trees t ON s.species_id = t.species_id
            GROUP BY s.species_id
            ORDER BY count DESC
        """
        species_distribution = self.db.execute_query(species_query)
        
        # Estadísticas de confianza
        confidence_query = """
            SELECT 
                ROUND(AVG(detection_confidence) * 100, 2) as avg_confidence,
                ROUND(MIN(detection_confidence) * 100, 2) as min_confidence,
                ROUND(MAX(detection_confidence) * 100, 2) as max_confidence
            FROM trees
        """
        confidence_results = self.db.execute_query(confidence_query)
        confidence_stats = confidence_results[0] if confidence_results else {}
        
        return {
            "total_trees": total_trees,
            "total_images": total_images,
            "average_trees_per_image": round(total_trees / total_images, 1) if total_images > 0 else 0,
            "species_distribution": species_distribution,
            "confidence_stats": confidence_stats
        }