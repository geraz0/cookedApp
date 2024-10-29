import React, { useState } from 'react';

const Login = ({ setIsLoggedIn, setIsRegisterView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => Promise.reject(error));
        }
        return response.json();
      })
      .then(data => {
        console.log('Logged in:', data.user);
        setIsLoggedIn(data.user.id, data.user.username); // Pass uid and username back to App
      })
      .catch(error => {
        console.log('Login error:', error.message);
        alert(error.message); // Display error to the user
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
          autoComplete="email"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleLogin} style={styles.loginButton}>Login</button>
        <button onClick={() => setIsRegisterView(true)} style={styles.registerButton}>Register</button>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    margin: '50px auto',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px',
    gap: '10px',
  },
  loginButton: {
    flex: 1,
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  registerButton: {
    flex: 1,
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;
