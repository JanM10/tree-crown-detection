# src/api/database/connection.py
import sqlite3
import os
from typing import List, Dict

class DatabaseConnection:
    def __init__(self, db_path: str = None):
        if db_path is None:
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            self.db_path = os.path.join(current_dir, 'tree_detection.db')
        else:
            self.db_path = db_path
        
        self._verify_database_exists()

    def _verify_database_exists(self):
        """Verificar que la base de datos existe"""
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"❌ No se encontró la base de datos en: {self.db_path}")

    def get_connection(self):
        """Crear conexión a la base de datos"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def rows_to_dict(rows) -> List[Dict]:
        """Convertir resultado de query a lista de diccionarios"""
        return [dict(row) for row in rows] if rows else []

    def execute_query(self, query: str, params: tuple = None) -> List[Dict]:
        """Ejecutar query y retornar resultados como diccionarios"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params or ())
            return self.rows_to_dict(cursor.fetchall())

    def execute_scalar(self, query: str, params: tuple = None):
        """Ejecutar query y retornar un solo valor"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params or ())
            result = cursor.fetchone()
            return result[0] if result else None