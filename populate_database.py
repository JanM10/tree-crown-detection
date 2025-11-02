# populate_database.py
import sqlite3
import os
from datetime import datetime

def populate_sample_data():
    """Insertar datos de ejemplo en la base de datos"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'src', 'tree_detection.db')
    
    if not os.path.exists(db_path):
        print(f"❌ No se encontró la base de datos en: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("🌱 Insertando datos de ejemplo...")
    
    try:
        # 1. Insertar especies
        species_data = [
            (1, 'Roble', 'Quercus robur', 25.0, 15.0, 'Árbol de hoja caduca'),
            (2, 'Pino', 'Pinus sylvestris', 30.0, 12.0, 'Conífera perenne'),
            (3, 'Arce', 'Acer pseudoplatanus', 20.0, 10.0, 'Árbol ornamental'),
            (4, 'Eucalipto', 'Eucalyptus globulus', 35.0, 18.0, 'Árbol de crecimiento rápido'),
            (5, 'Palmera', 'Phoenix dactylifera', 15.0, 8.0, 'Palmera ornamental')
        ]
        
        cursor.executemany("""
        INSERT OR IGNORE INTO species 
        (species_id, common_name, scientific_name, average_height_m, crown_diameter_m, description)
        VALUES (?, ?, ?, ?, ?, ?)
        """, species_data)
        
        print("   ✅ Especies insertadas")
        
        # 2. Insertar imágenes de ejemplo
        images_data = [
            ('aerial_photo_001.jpg', 640, 640, 9.9350, -84.0900, 0.78, 5000, datetime.now().isoformat()),
            ('aerial_photo_002.jpg', 640, 640, 9.9360, -84.0910, 0.78, 4800, datetime.now().isoformat()),
            ('aerial_photo_003.jpg', 640, 640, 9.9340, -84.0890, 0.78, 5200, datetime.now().isoformat())
        ]
        
        cursor.executemany("""
        INSERT OR IGNORE INTO images 
        (filename, width, height, gps_center_lat, gps_center_lon, meters_per_pixel, coverage_area_m2, processing_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, images_data)
        
        print("   ✅ Imágenes insertadas")
        
        # 3. Insertar árboles detectados (ejemplo)
        trees_data = []
        image_ids = [1, 2, 3]  # IDs de las imágenes que acabamos de insertar
        
        for i in range(50):  # Insertar 50 árboles de ejemplo
            image_id = image_ids[i % 3]  # Rotar entre las 3 imágenes
            species_id = (i % 5) + 1  # Rotar entre las 5 especies
            
            tree_data = (
                image_id, 
                species_id,
                0.1 + (i * 0.015),  # bbox_x_center
                0.1 + (i * 0.012),  # bbox_y_center  
                0.08,               # bbox_width
                0.09,               # bbox_height
                9.9350 + (i * 0.0001),  # gps_lat
                -84.0900 - (i * 0.0001), # gps_lon
                0.7 + (i * 0.005),  # detection_confidence (0.7-0.95)
                20.0 + (i * 0.5),   # estimated_height_m
                10.0 + (i * 0.3),   # estimated_crown_diameter_m
                datetime.now().isoformat()
            )
            trees_data.append(tree_data)
        
        cursor.executemany("""
        INSERT OR IGNORE INTO trees 
        (image_id, species_id, bbox_x_center, bbox_y_center, bbox_width, bbox_height, 
         gps_lat, gps_lon, detection_confidence, estimated_height_m, estimated_crown_diameter_m, detection_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, trees_data)
        
        # 4. Actualizar conteo de árboles en imágenes
        for image_id in image_ids:
            cursor.execute("""
            UPDATE images 
            SET total_trees_detected = (
                SELECT COUNT(*) FROM trees WHERE image_id = ?
            )
            WHERE image_id = ?
            """, (image_id, image_id))
        
        conn.commit()
        print("   ✅ Árboles insertados")
        
        # Mostrar estadísticas
        cursor.execute("SELECT COUNT(*) FROM trees")
        tree_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM images") 
        image_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM species")
        species_count = cursor.fetchone()[0]
        
        print(f"\n📊 ESTADÍSTICAS FINALES:")
        print(f"   - Árboles: {tree_count}")
        print(f"   - Imágenes: {image_count}") 
        print(f"   - Especies: {species_count}")
        print(f"   - Base de datos: {db_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    populate_sample_data()