// frontend/src/App.jsx
import { useState } from 'react';
import Home from './pages/Home';
import ImagesPage from './pages/ImagesPage';
import { Image, Home as HomeIcon } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'images':
        return <ImagesPage />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Header Mejorado con Navegación */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <span className="text-2xl text-white">🌳</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Tree Crown Detection
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Sistema de detección con YOLOv8
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  currentPage === 'home' 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Inicio</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('images')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  currentPage === 'images' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Imágenes</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {renderPage()}
      </main>

      {/* Footer (igual que antes) */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span className="text-2xl">🌲</span>
              <p className="text-gray-700 font-medium">
                Tree Crown Detection System
              </p>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Desarrollado con React + Flask + YOLOv8 | 
              <a 
                href="https://github.com/JanM10/tree-crown-detection" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 ml-1 font-semibold transition-colors duration-200"
              >
                Ver en GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;