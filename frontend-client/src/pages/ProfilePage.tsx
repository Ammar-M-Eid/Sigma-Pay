import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.updateAccount(userId, email, phoneNumber, address);
    setMessage(response.message || (response.success ? 'Profile updated successfully' : 'Failed to update profile'));
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.changeUsername(userId, newUsername);
    setMessage(response.message || (response.success ? 'Username changed successfully' : 'Failed to change username'));
    if (response.success) {
      setNewUsername('');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.changePassword(userId, oldPassword, newPassword);
    setMessage(response.message || (response.success ? 'Password changed successfully' : 'Failed to change password'));
    if (response.success) {
      setOldPassword('');
      setNewPassword('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Account Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Update Profile Information</h2>
        <form onSubmit={handleUpdateProfile} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Update Profile
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Change Username</h2>
        <form onSubmit={handleChangeUsername} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Username:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Change Username
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Change Password</h2>
        <form onSubmit={handleChangePassword} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  section: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    animation: 'fadeInUp 0.5s ease',
  },
  subtitle: {
    color: '#2d3748',
    marginBottom: '24px',
    fontSize: '22px',
    fontWeight: '600',
    borderBottom: '3px solid #646cff',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  button: {
    padding: '16px',
    fontSize: '17px',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(100, 108, 255, 0.4)',
  },
  message: {
    marginTop: '24px',
    padding: '16px',
    background: 'linear-gradient(135deg, #c3e6cb 0%, #a3d9a5 100%)',
    border: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
  },
};

export default ProfilePage;
