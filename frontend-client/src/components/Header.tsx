import React from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userId: string | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onNavigate('auth');
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>💰 SigmaPay</h1>
          <p style={styles.tagline}>Smart Personal Finance</p>
        </div>

        {userId && (
          <nav style={styles.nav}>
            {[
              { key: 'budgets', label: '📊 Budgets', icon: '💵' },
              { key: 'goals', label: '🎯 Goals', icon: '🎯' },
              { key: 'groups', label: '👥 Groups', icon: '👥' },
              { key: 'payments', label: '💳 Payments', icon: '💳' },
              { key: 'reports', label: '📈 Reports', icon: '📈' },
              { key: 'notifications', label: '🔔 Alerts', icon: '🔔' },
              { key: 'profile', label: '👤 Profile', icon: '👤' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                style={currentPage === key ? styles.navButtonActive : styles.navButton}
                onClick={() => onNavigate(key)}
                title={label}
              >
                <span style={styles.navIcon}>{icon}</span>
                <span style={styles.navLabel}>{label.split(' ')[1]}</span>
              </button>
            ))}
          </nav>
        )}

        {userId && (
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <span style={styles.userLabel}>User:</span>
              <span style={styles.userId}>{userId.substring(0, 8)}...</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    padding: '16px 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  tagline: {
    margin: 0,
    fontSize: '12px',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  nav: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    marginRight: '4px',
    fontSize: '16px',
  },
  navLabel: {
    fontSize: '12px',
    fontWeight: '600',
  },
  navButton: {
    padding: '8px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navButtonActive: {
    padding: '8px 14px',
    background: 'white',
    color: '#646cff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    fontSize: '13px',
    opacity: 0.95,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '6px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  userLabel: {
    fontWeight: '600',
    fontSize: '12px',
    opacity: 0.8,
  },
  userId: {
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 87, 34, 0.3)',
    color: 'white',
    border: '2px solid rgba(255, 87, 34, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  },
};

export default Header;
