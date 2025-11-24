// frontend/src/App.jsx
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌳</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tree Crown Detection
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema de detección con YOLOv8
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Home />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Desarrollado con React + Flask + YOLOv8 | 
            <a 
              href="https://github.com/tu-usuario/tree-crown-detection" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 ml-1"
            >
              Ver en GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;