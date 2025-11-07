# src/api/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from .routes import api_bp

def create_app():
    """
    Funcion factory para crear la aplicacion Flask.
    Se utiliza el patron de diseno Factory para mejorar testing y configuracion.
    """
    app = Flask(__name__)
    
    # Configuracion general
    app.config['JSON_SORT_KEYS'] = False  # Mantener el orden original en respuestas JSON
    app.config['DEBUG'] = True  # Cambiar a False en produccion
    
    # Habilitar CORS para todos los dominios
    CORS(app)
    
    # Registrar Blueprints (modulos de rutas)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # ============================================
    # RUTA PRINCIPAL
    # ============================================
    @app.route('/')
    def home():
        return jsonify({
            "message": "Tree Detection API",
            "version": "1.0",
            "status": "running",
            "endpoints": {
                "api_info": "/api/info",
                "documentation": "Ver /api/info para todos los endpoints"
            }
        })
    
    # ============================================
    # MANEJADORES DE ERRORES GLOBALES
    # ============================================
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": "Endpoint no encontrado. Ver /api/info para endpoints disponibles."
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "success": False,
            "error": "Error interno del servidor."
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": "Solicitud incorrecta."
        }), 400
    
    return app
