import React, { useState } from 'react';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import GroupSavingsPage from './pages/GroupSavingsPage';
import NotificationsPage from './pages/NotificationsPage';

type Page = 'auth' | 'budgets' | 'goals' | 'reports' | 'profile' | 'payments' | 'groups' | 'notifications';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [userId, setUserId] = useState<string | null>(null);

  const handleLoginSuccess = (id: string) => {
    setUserId(id);
    setCurrentPage('budgets');
  };

  const handleNavigate = (page: string) => {
    if (page === 'auth') {
      setUserId(null);
    }
    setCurrentPage(page as Page);
  };

  return (
    <div className="app-shell" style={styles.app}>
      <Header currentPage={currentPage} onNavigate={handleNavigate} userId={userId} />
      
      <main style={styles.main}>
        {currentPage === 'auth' && <AuthPage onLoginSuccess={handleLoginSuccess} />}
        {currentPage === 'budgets' && userId && <BudgetPage userId={userId} />}
        {currentPage === 'goals' && userId && <GoalsPage userId={userId} />}
        {currentPage === 'reports' && userId && <ReportsPage userId={userId} />}
        {currentPage === 'profile' && userId && <ProfilePage userId={userId} />}
        {currentPage === 'payments' && userId && <PaymentsPage userId={userId} />}
        {currentPage === 'groups' && userId && <GroupSavingsPage userId={userId} />}
        {currentPage === 'notifications' && userId && <NotificationsPage userId={userId} />}
      </main>

      <footer className="app-footer" style={styles.footer}>
        <p style={styles.footerText}>SigmaPay <span>•</span> Personal finance, made clear.</p>
        <p style={styles.footerSubtext}>Secure planning for the decisions ahead.</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f7f8',
  },
  main: {
    flex: 1,
    paddingBottom: '56px',
  },
  footer: {
    background: '#17212b',
    color: '#d9e2e5',
    padding: '24px 20px',
    textAlign: 'left',
    marginTop: 'auto',
    boxShadow: 'none',
  },
  footerText: {
    margin: '0 auto 4px',
    maxWidth: '1200px',
    fontSize: '14px',
    fontWeight: '600',
  },
  footerSubtext: {
    margin: '0 auto',
    maxWidth: '1200px',
    fontSize: '13px',
    color: '#91a0a8',
  },
};

export default App;
