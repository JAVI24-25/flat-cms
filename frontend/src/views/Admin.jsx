import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [formVisible, setFormVisible] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState({ titulo: "", contenido: "", autor: "", imagen: "" });
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cargar = () => {
    axios.get("http://localhost:5000/api/noticias").then(res => setNoticias(res.data));
  };

  useEffect(() => cargar(), []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleForm = () => setFormVisible(!formVisible);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, imagen: reader.result });
      setPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const crear = () => {
    axios.post("http://localhost:5000/api/noticias", form)
      .then(() => {
        cargar();
        resetForm();
      })
      .catch(err => console.error(err));
  };

  const editar = (noticia) => {
    setForm({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      autor: noticia.autor,
      imagen: noticia.imagen
    });
    setPreview(noticia.imagen);
    setFormVisible(true);
    setEditingId(noticia.id);
  };

  const guardarEdicion = () => {
    axios.put(`http://localhost:5000/api/noticias/${editingId}`, form)
      .then(() => {
        cargar();
        resetForm();
      })
      .catch(err => console.error(err));
  };

  const eliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta noticia?")) {
      axios.delete(`http://localhost:5000/api/noticias/${id}`).then(() => cargar());
    }
  };

  const resetForm = () => {
    setForm({ titulo: "", contenido: "", autor: "", imagen: "" });
    setPreview("");
    setFormVisible(false);
    setEditingId(null);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="admin-container">
      {/* Header con menú de perfil profesional */}
      <header className="admin-header">
        <div className="header-left">
          <h1>📰 Panel Administrador</h1>
        </div>
        
        <div className="header-right">
          <button className="btn-primary" onClick={toggleForm}>
            + Nueva Noticia
          </button>
          
          {/* Menú de perfil profesional */}
          <div className="profile-menu-container">
            <div className="profile-trigger" onClick={toggleMenu}>
              <div className="profile-avatar">
                <span className="avatar-icon">👑</span>
              </div>
              <span className="profile-name">Admin</span>
              <span className={`profile-arrow ${menuOpen ? 'open' : ''}`}>▼</span>
            </div>
            
            {menuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">👑</div>
                  <div className="dropdown-user-info">
                    <strong>Administrador</strong>
                    <span>admin@noti.com</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-item">
                  <span className="item-icon">📊</span>
                  Dashboard
                </div>
                
                <div className="dropdown-item">
                  <span className="item-icon">⚙️</span>
                  Configuración
                </div>
                
                <div className="dropdown-item">
                  <span className="item-icon">👥</span>
                  Perfil
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="item-icon">⏻</span>
                  <span>Cerrar sesión</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {formVisible && (
        <div className="form-container">
          <input 
            placeholder="Título" 
            value={form.titulo} 
            onChange={e => setForm({ ...form, titulo: e.target.value })} 
          />
          <textarea 
            placeholder="Contenido" 
            value={form.contenido} 
            onChange={e => setForm({ ...form, contenido: e.target.value })}
          ></textarea>
          <input 
            placeholder="Autor" 
            value={form.autor} 
            onChange={e => setForm({ ...form, autor: e.target.value })} 
          />
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && <img src={preview} className="preview-img" alt="Preview" />}
          <div className="form-buttons">
            <button className="btn-primary" onClick={editingId ? guardarEdicion : crear}>
              {editingId ? "Guardar Cambios" : "Publicar"}
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="news-container">
        {noticias.map(n => (
          <div key={n.id} className="news-card">
            <img src={n.imagen} alt={n.titulo} />
            <div className="news-content">
              <h2>{n.titulo}</h2>
              <p>{n.contenido}</p>
              <small>{n.autor} - {new Date(n.fecha).toLocaleDateString()}</small>
              <div className="btn-group">
                <button className="btn-primary" onClick={() => editar(n)}>Editar</button>
                <button className="btn-primary btn-delete" onClick={() => eliminar(n.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;