# src/api/database/__init__.py
from .connection import DatabaseConnection
from .queries import SpeciesQueries, TreeQueries, ImageQueries, StatisticsQueries

class DatabaseManager:
    """Facade para acceder a todas las funcionalidades de la base de datos"""
    
    def __init__(self, db_path: str = None):
        self.connection = DatabaseConnection(db_path)
        self.species = SpeciesQueries(self.connection)
        self.trees = TreeQueries(self.connection)
        self.images = ImageQueries(self.connection)
        self.statistics = StatisticsQueries(self.connection)