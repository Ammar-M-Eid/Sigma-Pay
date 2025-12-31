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
    <div style={styles.app}>
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

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          SigmaPay © 2024 - Personal Finance Management System
        </p>
        <p style={styles.footerSubtext}>
          Built with React & TypeScript | Backend: Node.js & Express
        </p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    backgroundAttachment: 'fixed',
  },
  main: {
    flex: 1,
    paddingBottom: '80px',
  },
  footer: {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    marginTop: 'auto',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
  },
  footerText: {
    margin: '8px 0',
    fontSize: '15px',
    fontWeight: '500',
  },
  footerSubtext: {
    margin: '8px 0',
    fontSize: '13px',
    opacity: 0.8,
  },
};

export default App;
