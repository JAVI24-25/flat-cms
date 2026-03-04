import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [noticias, setNoticias] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const res = await axios.get(`${API_URL}/api/noticias`);
      setNoticias(res.data);
      
      // Generar categorías basadas en las noticias
      const cats = {};
      res.data.forEach(noticia => {
        if (!cats[noticia.categoria]) {
          cats[noticia.categoria] = {
            id: noticia.categoria,
            nombre: noticia.categoria.charAt(0).toUpperCase() + noticia.categoria.slice(1),
            count: 0,
            icono: getIconoPorCategoria(noticia.categoria)
          };
        }
        cats[noticia.categoria].count++;
      });
      
      setCategorias([
        { id: "todas", nombre: "Todas", icono: "📰", count: res.data.length, color: "#667eea" },
        ...Object.values(cats)
      ]);
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  const getIconoPorCategoria = (categoria) => {
    const iconos = {
      ciencia: "🔬",
      tecnologia: "💻",
      deportes: "⚽",
      default: "📰"
    };
    return iconos[categoria.toLowerCase()] || iconos.default;
  };

  const getColorPorCategoria = (categoria) => {
    const colores = {
      ciencia: "#48bb78",
      tecnologia: "#4299e1",
      deportes: "#ed8936",
      default: "#667eea"
    };
    return colores[categoria.toLowerCase()] || colores.default;
  };

  const noticiasFiltradas = selectedCategory === "todas" 
    ? noticias 
    : noticias.filter(n => n.categoria?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate("/")}>
            <span className="logo-icon">📰</span>
            <h1>NOTI</h1>
          </div>
          <button onClick={() => navigate("/")} className="logout-btn">
            <span>🔑</span> Cambiar usuario
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Bienvenido a NOTI</h2>
          <p>Información confiable y actualizada</p>
          <div className="stats">
            <span>📊 {noticias.length} noticias disponibles</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categorias.length > 0 && (
        <section className="categories-section">
          <div className="section-title">
            <h3>Categorías</h3>
            <p>Explora noticias por tema</p>
          </div>
          <div className="categories-grid">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ borderColor: selectedCategory === cat.id ? getColorPorCategoria(cat.id) : '#e0e0e0' }}
              >
                <span className="category-icon">{cat.icono}</span>
                <span className="category-name">{cat.nombre}</span>
                <span className="category-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="news-section">
        <div className="section-title">
          <h3>
            {selectedCategory === "todas" 
              ? "Últimas noticias" 
              : `Noticias de ${categorias.find(c => c.id === selectedCategory)?.nombre || selectedCategory}`}
          </h3>
          <p>Las noticias más recientes</p>
        </div>
        
        <div className="news-grid">
          {noticiasFiltradas.length > 0 ? (
            noticiasFiltradas.map(noticia => (
              <article key={noticia.id} className="news-card">
                {noticia.imagen && (
                  <img 
                    src={noticia.imagen} 
                    alt={noticia.titulo}
                    className="news-image"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="news-content">
                  <div className="news-meta">
                    {noticia.categoria && (
                      <span className="news-category" style={{
                        backgroundColor: getColorPorCategoria(noticia.categoria) + '20',
                        color: getColorPorCategoria(noticia.categoria)
                      }}>
                        {noticia.categoria}
                      </span>
                    )}
                    <span className="news-date">
                      {new Date(noticia.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h4>{noticia.titulo}</h4>
                  <p>{noticia.contenido}</p>
                  {noticia.autor && (
                    <small className="news-author">Por: {noticia.autor}</small>
                  )}
                  <button className="read-more-btn">
                    Leer más →
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="no-news">No hay noticias disponibles en esta categoría</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h4>NOTI</h4>
            <p>Información confiable y actualizada.</p>
          </div>
          <div className="footer-sections">
            <h5>Secciones</h5>
            <ul>
              <li>Últimas noticias</li>
              <li>Categorías</li>
              <li>Tendencias</li>
            </ul>
          </div>
          <div className="footer-social">
            <h5>Redes sociales</h5>
            <div className="social-links">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 NOTI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;