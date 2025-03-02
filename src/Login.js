import React, { useState } from 'react';
import './Register.css'; // Reutilizamos el mismo CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      // Corrección del endpoint para coincidir con el backend
      const response = await fetch('http://localhost:8080/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.text();

      if (response.ok) {
        setMensaje(data); // "Inicio de sesión exitoso"
        // Aquí podrías guardar el estado de sesión o redirigir al usuario
      } else {
        setError(data); // "Usuario no encontrado" o "Contraseña incorrecta"
      }
    } catch (err) {
      setError('Error en la conexión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="error-message">{error}</p>}
        {mensaje && <p className="success-message">{mensaje}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;