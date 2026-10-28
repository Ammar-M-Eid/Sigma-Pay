import React, { useState } from 'react';

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
    minHeight: 'calc(100vh - 150px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '56px 20px',
    background: '#f5f7f8',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    padding: '44px',
    background: 'white',
    borderRadius: '18px',
    border: '1px solid #e4e9ec',
    boxShadow: '0 22px 60px rgba(23, 33, 43, .09)',
  },
  header: {
    textAlign: 'left',
    marginBottom: '34px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 800,
    color: '#17212b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#687581',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#52616b',
    marginBottom: '7px',
    letterSpacing: '.02em',
  },
  input: {
    padding: '13px 14px',
    fontSize: '14px',
    border: '1px solid #d5dde1',
    borderRadius: '9px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#fbfcfc',
  },
  inputError: {
    borderColor: '#bd554d',
    backgroundColor: '#fff8f7',
  },
  errorText: {
    fontSize: '12px',
    color: '#bd554d',
    marginTop: '6px',
    fontWeight: '500',
  },
  button: {
    padding: '14px',
    fontSize: '14px',
    fontWeight: '700',
    background: '#087f77',
    color: 'white',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 8px 18px rgba(8, 127, 119, .18)',
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
    background: '#e7f4f1',
    color: '#05635d',
  },
  errorMessage: {
    background: '#fff0ee',
    color: '#8f3d37',
  },
  divider: {
    textAlign: 'center',
    margin: '30px 0 20px 0',
    fontSize: '14px',
    color: '#87949b',
  },
  registerButton: {
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#fff',
    color: '#087f77',
    border: '1px solid #b7d8d3',
    borderRadius: '9px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  disclaimer: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#87949b',
    textAlign: 'center',
  },
};

export default LoginPage;
