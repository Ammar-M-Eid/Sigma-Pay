import React from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userId: string | null;
}

const navigation = [
  { key: 'budgets', label: 'Overview' },
  { key: 'goals', label: 'Goals' },
  { key: 'groups', label: 'Circles' },
  { key: 'payments', label: 'Payments' },
  { key: 'reports', label: 'Insights' },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) onNavigate('auth');
  };

  return (
    <header className="topbar" style={styles.header}>
      <div className="topbar-inner" style={styles.container}>
        <button className="brand" style={styles.brand} onClick={() => userId && onNavigate('budgets')}>
          <span style={styles.mark}>Σ</span>
          <span>
            <strong style={styles.logo}>SigmaPay</strong>
            <small style={styles.tagline}>Your money, in focus.</small>
          </span>
        </button>

        {userId && (
          <nav className="main-nav" style={styles.nav} aria-label="Primary navigation">
            {navigation.map(({ key, label }) => (
              <button
                key={key}
                className={currentPage === key ? 'nav-item active' : 'nav-item'}
                style={currentPage === key ? styles.navButtonActive : styles.navButton}
                onClick={() => onNavigate(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        {userId && (
          <div className="topbar-actions" style={styles.userSection}>
            <button className="icon-link" style={styles.iconButton} onClick={() => onNavigate('notifications')} aria-label="Notifications">⌁</button>
            <button className="profile-chip" style={styles.profileChip} onClick={() => onNavigate('profile')}>
              <span style={styles.avatar}>AM</span>
              <span style={styles.userId}>Account</span>
            </button>
            <button className="logout-link" onClick={handleLogout} style={styles.logoutButton}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: { background: '#fff', borderBottom: '1px solid #e4e9ec', position: 'sticky', top: 0, zIndex: 1000 },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 28px', minHeight: '76px', display: 'flex', alignItems: 'center', gap: '36px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', border: 0, background: 'transparent', padding: 0, color: '#17212b', textAlign: 'left' },
  mark: { display: 'grid', placeItems: 'center', width: '34px', height: '34px', borderRadius: '10px', background: '#087f77', color: '#fff', fontSize: '22px', fontWeight: 800 },
  logo: { display: 'block', fontFamily: "'Manrope', sans-serif", fontSize: '17px', letterSpacing: '-.03em' },
  tagline: { display: 'block', color: '#87949b', fontSize: '10px', marginTop: '2px', letterSpacing: '.02em' },
  nav: { display: 'flex', alignItems: 'center', gap: '4px', flex: 1 },
  navButton: { background: 'transparent', border: 0, color: '#687581', padding: '10px 13px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 },
  navButtonActive: { background: '#e7f4f1', border: 0, color: '#05635d', padding: '10px 13px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 },
  userSection: { display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' },
  iconButton: { border: 0, background: 'transparent', fontSize: '23px', color: '#687581', padding: '4px 8px' },
  profileChip: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 0, color: '#17212b', fontSize: '13px', fontWeight: 600 },
  avatar: { display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '50%', background: '#f6dfc9', color: '#8a552c', fontSize: '10px', fontWeight: 800 },
  userId: { fontSize: '13px' },
  logoutButton: { border: 0, background: 'transparent', color: '#87949b', fontSize: '12px', padding: '6px 0' },
};

export default Header;
