import React, { useState } from 'react';

const Register = ({ setIsRegistered }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => Promise.reject(error));
        }
        return response.json();
      })
      .then(data => {
        console.log('Registered:', data.username);
        setIsRegistered(true);
      })
      .catch(error => {
        console.log('Error:', error.error);
        alert(error.error); // Displaying error to the user
      });
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          placeholder="Enter your username"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="username">Email:</label>
        <input
          type="text"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
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
        />
      </div>

      <button onClick={handleRegister} style={styles.registerButton}>Register</button>
    </div>
  );
};

// Inline styles for the Register component
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
    width: '90%',
    maxWidth: '400px',
    margin: '50px auto', // Uniform margin on all sides
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
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
  registerButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    marginTop: '20px',
  },
};

export default Register;
