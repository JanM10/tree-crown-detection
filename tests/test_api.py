# test_api.py
import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoint(endpoint, name):
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"{name}: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Respuesta: {json.dumps(data, indent=2)[:200]}...")
        return response.status_code == 200
    except Exception as e:
        print(f" {name}: Error - {e}")
        return False

print("INICIANDO PRUEBAS DEL API...")
print("=" * 50)

# Probar endpoints principales
endpoints = [
    ("/", "Página principal"),
    ("/api/info", "Información del API"),
    ("/api/stats", "Estadísticas"),
    ("/api/species", "Lista de especies"),
    ("/api/trees?page=1&per_page=5", "Árboles paginados"),
    ("/api/images", "Imágenes procesadas")
]

success_count = 0
for endpoint, name in endpoints:
    if test_endpoint(endpoint, name):
        success_count += 1
    print()

print("=" * 50)
print(f"RESULTADO: {success_count}/{len(endpoints)} pruebas exitosas")

if success_count == len(endpoints):
    print("¡Todas las pruebas pasaron! El API está funcionando correctamente.")
else:
    print("Algunas pruebas fallaron. Revisa los errores arriba.")