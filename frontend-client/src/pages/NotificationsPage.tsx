import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface NotificationsPageProps {
  userId: string;
}

interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [preferenceType, setPreferenceType] = useState('email');
  const [isEnabled, setIsEnabled] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadNotifications = async () => {
    const response = await apiClient.getNotifications(userId);
    if (response.success && response.notifications) {
      setNotifications(response.notifications);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.sendAlert(userId, alertMessage);
    setMessage(response.success ? 'Alert sent successfully!' : 'Failed to send alert');
    if (response.success) {
      setAlertMessage('');
      loadNotifications();
    }
  };

  const handleSetPreference = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.setNotificationPreference(userId, preferenceType, isEnabled);
    setMessage(response.success ? 'Preference updated successfully!' : 'Failed to update preference');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Notification History</h2>
        {notifications.length === 0 ? (
          <p style={styles.emptyMessage}>No notifications yet</p>
        ) : (
          <div style={styles.notificationList}>
            {notifications.map((notification) => (
              <div key={notification.notificationId} style={styles.notificationCard}>
                <div style={styles.notificationHeader}>
                  <span style={styles.notificationType}>{notification.type}</span>
                  <span style={styles.notificationTime}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <span style={notification.read ? styles.readBadge : styles.unreadBadge}>
                  {notification.read ? 'Read' : 'Unread'}
                </span>
              </div>
            ))}
          </div>
        )}
        <button onClick={loadNotifications} style={styles.button}>
          Refresh Notifications
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Send Custom Alert</h2>
        <form onSubmit={handleSendAlert} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Alert Message:</label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              required
              style={{ ...styles.input, minHeight: '100px' }}
            />
          </div>
          <button type="submit" style={styles.button}>
            Send Alert
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Notification Preferences</h2>
        <form onSubmit={handleSetPreference} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Notification Type:</label>
            <select
              value={preferenceType}
              onChange={(e) => setPreferenceType(e.target.value)}
              style={styles.input}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notifications</option>
              <option value="budget">Budget Alerts</option>
              <option value="goals">Goal Updates</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                style={styles.checkbox}
              />
              Enabled
            </label>
          </div>
          <button type="submit" style={styles.button}>
            Update Preference
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#4a5568',
    fontWeight: '500',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    accentColor: '#646cff',
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
    background: 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)',
    border: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(103, 58, 183, 0.2)',
  },
  notificationList: {
    marginBottom: '20px',
  },
  notificationCard: {
    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8eaf6 100%)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(103, 58, 183, 0.1)',
    transition: 'transform 0.2s ease',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    alignItems: 'center',
  },
  notificationType: {
    fontWeight: '600',
    color: '#673AB7',
    textTransform: 'capitalize',
    fontSize: '16px',
  },
  notificationTime: {
    fontSize: '12px',
    color: '#718096',
  },
  notificationMessage: {
    color: '#2d3748',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  readBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '20px',
    backgroundColor: '#e0e0e0',
    color: '#666',
    fontWeight: '500',
  },
  unreadBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '40px 20px',
    fontSize: '16px',
  },
};

export default NotificationsPage;
