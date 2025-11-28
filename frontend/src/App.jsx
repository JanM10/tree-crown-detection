// frontend/src/App.jsx
import { useState } from "react";
import Home from "./pages/Home";
import ImagesPage from "./pages/ImagesPage";
import { Image, Home as HomeIcon, Leaf } from "lucide-react";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "images":
        return <ImagesPage />;
      case "home":
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30"
      style={{ width: "100%", margin: 0, padding: 0 }}
    >
      {/* Header con estilo forzado */}
      <header
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-50"
        style={{ width: "100%", margin: 0, padding: 0 }}
      >
        <div
          className="w-full"
          style={{
            paddingLeft: "3rem",
            paddingRight: "3rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-800 bg-clip-text text-transparent">
                  Tree Crown Detection
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Sistema de detección con YOLOv8
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {" "}
              {/* Cambiado de space-x-2 a space-x-4 */}
              <button
                onClick={() => setCurrentPage("home")}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium text-base ${
                  currentPage === "home"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <HomeIcon className="w-5 h-5" />{" "}
                {/* Aumentado de w-4 h-4 a w-5 h-5 */}
                <span>Inicio</span>
              </button>
              <button
                onClick={() => setCurrentPage("images")}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium text-base ${
                  currentPage === "images"
                    ? "bg-blue-100 text-blue-700 shadow-sm border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <Image className="w-5 h-5" />{" "}
                <span>Imágenes</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content con estilo forzado */}
      <main style={{ width: "100%", margin: 0, padding: 0 }}>
        <div
          className="w-full"
          style={{
            paddingLeft: "3rem",
            paddingRight: "3rem",
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          {renderPage()}
        </div>
      </main>

      {/* Footer con estilo forzado */}
      <footer
        className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 mt-16"
        style={{ width: "100%", margin: 0, padding: 0 }}
      >
        <div
          className="w-full"
          style={{
            paddingLeft: "3rem",
            paddingRight: "3rem",
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  Tree Crown Detection System
                </p>
                <p className="text-gray-500 text-sm">
                  Tecnología avanzada para análisis forestal
                </p>
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Desarrollado con React + Flask + YOLOv8 |
              <a
                href="https://github.com/JanM10/tree-crown-detection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 ml-1 font-semibold transition-colors duration-200"
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
