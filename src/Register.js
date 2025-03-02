import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Expresión regular para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validación de campos vacíos
    if (!nombre || !apellido || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validación del formato de correo electrónico
    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const usuario = { nombre, apellido, email, password };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/usuario/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      // Manejo de la respuesta dependiendo del tipo (texto o JSON)
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Para manejar tanto respuestas de texto como de objetos
        const errorMessage = typeof data === 'object' ? data.message || 'Error al registrar' : data;
        setError(errorMessage);
      } else {
        const successMessage = typeof data === 'object' ? data.message || 'Registro exitoso' : data;
        setMensaje(successMessage);
        // Limpiamos los campos después de un registro exitoso
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      setError('Error en la conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={email && !validateEmail(email) ? "invalid-input" : ""}
          />
          {email && !validateEmail(email) && 
            <p className="validation-message">Ingresa un correo válido</p>
          }
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={password && password.length < 6 ? "invalid-input" : ""}
          />
          {password && password.length < 6 && 
            <p className="validation-message">Mínimo 6 caracteres</p>
          }
        </div>

        {error && <p className="error-message">{error}</p>}
        {mensaje && <p className="success-message">{mensaje}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;