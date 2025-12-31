import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import LoginPage from './LoginPage';

interface AuthPageProps {
  onLoginSuccess: (userId: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateRegisterForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Username validation (3-20 chars, alphanumeric)
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (username.length > 20) {
      newErrors.username = 'Username must not exceed 20 characters';
    } else if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (min 8 chars, must include uppercase, lowercase, number)
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation (10+ digits)
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must contain at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.register(username, email, password, phoneNumber);

      if (response.success) {
        setMessage('Account created successfully! Logging you in...');
        const mockUserId = 'user-' + Date.now();
        setTimeout(() => onLoginSuccess(mockUserId), 1500);
      } else {
        setMessage('Failed to create account: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoginMode ? (
        <LoginPage
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={() => setIsLoginMode(false)}
        />
      ) : (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.header}>
              <h1 style={styles.title}>SigmaPay</h1>
              <p style={styles.subtitle}>Create Your Account</p>
            </div>

            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  placeholder="john_doe"
                  maxLength={20}
                  style={{
                    ...styles.input,
                    ...(errors.username && styles.inputError),
                  }}
                />
                <p style={styles.helperText}>
                  3-20 characters, letters, numbers, and underscores only
                </p>
                {errors.username && <p style={styles.errorText}>{errors.username}</p>}
              </div>

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
                <p style={styles.helperText}>
                  Min 8 chars: uppercase, lowercase, number required
                </p>
                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="••••••••"
                  style={{
                    ...styles.input,
                    ...(errors.confirmPassword && styles.inputError),
                  }}
                />
                {errors.confirmPassword && (
                  <p style={styles.errorText}>{errors.confirmPassword}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber)
                      setErrors({ ...errors, phoneNumber: '' });
                  }}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    ...styles.input,
                    ...(errors.phoneNumber && styles.inputError),
                  }}
                />
                <p style={styles.helperText}>Must be 10+ digits</p>
                {errors.phoneNumber && (
                  <p style={styles.errorText}>{errors.phoneNumber}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...(isLoading && styles.buttonDisabled),
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {message && (
              <p
                style={{
                  ...styles.message,
                  ...(message.includes('successfully')
                    ? styles.successMessage
                    : styles.errorMessage),
                }}
              >
                {message}
              </p>
            )}

            <div style={styles.divider}>
              <span>Already have an account?</span>
            </div>

            <button
              onClick={() => setIsLoginMode(true)}
              style={styles.loginButton}
            >
              Sign In Here
            </button>
          </div>
        </div>
      )}
    </>
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
    maxWidth: '500px',
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
    gap: '20px',
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
  helperText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '4px',
    fontStyle: 'italic',
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
    marginTop: '20px',
    padding: '14px',
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
  loginButton: {
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
};

export default AuthPage;
