import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface LoginPageProps {
  onLoginSuccess: (userId: string) => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Mock login - in production, this would verify against backend
    try {
      // Simulate API call
      const mockUserId = 'user-' + Date.now();
      setMessage('Login successful!');
      setTimeout(() => onLoginSuccess(mockUserId), 800);
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>SigmaPay</h1>
          <p style={styles.subtitle}>Sign In to Your Account</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="you@example.com"
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError),
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError),
              }}
            />
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading && styles.buttonDisabled),
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              ...(message.includes('successful')
                ? styles.successMessage
                : styles.errorMessage),
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.divider}>
          <span>Don't have an account?</span>
        </div>

        <button
          onClick={onSwitchToRegister}
          style={styles.registerButton}
        >
          Create New Account
        </button>

        <p style={styles.disclaimer}>
          Demo account: Any email/password will work (min 6 chars)
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '50px 40px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.5s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  inputError: {
    borderColor: '#fc8181',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    fontSize: '13px',
    color: '#c53030',
    marginTop: '6px',
    fontWeight: '500',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '16px',
    boxShadow: '0 4px 15px rgba(100, 108, 255, 0.4)',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
  },
  successMessage: {
    background: '#c6f6d5',
    color: '#22543d',
  },
  errorMessage: {
    background: '#fed7d7',
    color: '#742a2a',
  },
  divider: {
    textAlign: 'center',
    margin: '30px 0 20px 0',
    fontSize: '14px',
    color: '#718096',
  },
  registerButton: {
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#edf2f7',
    color: '#646cff',
    border: '2px solid #646cff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  disclaimer: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#a0aec0',
    textAlign: 'center',
  },
};

export default LoginPage;
