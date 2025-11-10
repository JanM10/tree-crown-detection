# run.py
import os
import sys

# Agregar el directorio src al path para imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.api.app import create_app

# Crear aplicacion Flask (para Gunicorn)
app = create_app()

def main():
    """Funcion principal para ejecutar la aplicacion"""
    
    # Configuracion del servidor
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('PORT', os.getenv('FLASK_PORT', 5000)))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print("Tree Detection API")
    print("=" * 50)
    print("API iniciada correctamente")
    print(f"URL: http://{host}:{port}")
    print(f"Debug: {debug}")
    print(f"Endpoints disponibles en: http://{host}:{port}/api/info")
    print("=" * 50)
    print("Presiona Ctrl+C para detener el servidor")
    
    # Ejecutar aplicacion
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    main()
