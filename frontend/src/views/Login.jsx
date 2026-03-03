import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setIsAdmin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (password === "1234") {
      setIsAdmin(true);
      navigate("/admin");
    } else if (password === "") {
      setIsAdmin(false);
      navigate("/home");
    } else {
      setError("Contraseña incorrecta");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') login();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📰</span>
          <h1>NOTI</h1>
          <p>Portal de noticias confiable y actualizado</p>
        </div>

        <div className="login-form">
          <label>Contraseña de Administrador</label>
          <div className="password-input-container">
            <input
              type="password"
              placeholder="Ingresa contraseña (opcional)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={error ? "input-error" : ""}
            />
            {password && (
              <button onClick={() => setPassword("")} className="clear-btn">
                ✕
              </button>
            )}
          </div>
          {error && <p className="error-message">⚠️ {error}</p>}
        </div>

        <div className="info-box">
          <p>
            <span>💡 Información:</span><br />
            • Deja vacío para ingresar como usuario<br />
            • Usa "1234" para acceder como administrador
          </p>
        </div>

        <button onClick={login} className="login-btn">
          Ingresar al Portal
        </button>

        <button
          onClick={() => {
            setIsAdmin(false);
            navigate("/home");
          }}
          className="guest-btn"
        >
          Continuar como Invitado
        </button>

        <p className="footer-text">© 2024 NOTI. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

export default Login;