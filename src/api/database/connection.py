# src/api/database/connection.py
import sqlite3
import os
from typing import List, Dict

class DatabaseConnection:
    def __init__(self, db_path: str = None):
        """
        Inicializa la conexion a la base de datos.
        Si no se proporciona una ruta, se usa la base de datos por defecto (tree_detection.db).
        """
        if db_path is None:
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            self.db_path = os.path.join(current_dir, 'tree_detection.db')
        else:
            self.db_path = db_path
        
        self._verify_database_exists()

    def _verify_database_exists(self):
        """
        Verifica que la base de datos exista.
        Si no existe, lanza una excepcion FileNotFoundError.
        """
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"No se encontro la base de datos en: {self.db_path}")

    def get_connection(self):
        """
        Crea y retorna una conexion a la base de datos SQLite.
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def rows_to_dict(rows) -> List[Dict]:
        """
        Convierte el resultado de una consulta en una lista de diccionarios.
        """
        return [dict(row) for row in rows] if rows else []

    def execute_query(self, query: str, params: tuple = None) -> List[Dict]:
        """
        Ejecuta una consulta SQL y retorna los resultados como una lista de diccionarios.
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params or ())
            return self.rows_to_dict(cursor.fetchall())

    def execute_scalar(self, query: str, params: tuple = None):
        """
        Ejecuta una consulta SQL y retorna un unico valor (por ejemplo, COUNT o MAX).
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params or ())
            result = cursor.fetchone()
            return result[0] if result else None
