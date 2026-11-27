import React, { useEffect, useState } from 'react';
import Header, { Page } from './components/Header';
import OverviewPage from './pages/OverviewPage';
import AuthPage from './pages/AuthPage';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import GroupSavingsPage from './pages/GroupSavingsPage';
import NotificationsPage from './pages/NotificationsPage';
import BillsPage from './pages/BillsPage';
import FeatureHubPage from './pages/FeatureHubPage';

const pageSet: Page[] = ['overview', 'budgets', 'goals', 'groups', 'bills', 'payments', 'reports', 'features', 'notifications', 'profile', 'auth'];
const pageTitles: Partial<Record<Page, string>> = {
  overview: 'Overview', budgets: 'Budgets', goals: 'Savings goals', groups: 'Group savings',
  bills: 'Bills', payments: 'Payments', reports: 'Reports', features: 'Explore',
  notifications: 'Notifications', profile: 'Profile', auth: 'Account access',
};

function readPage(): Page {
  const value = window.location.hash.replace(/^#\/?/, '') as Page;
  return pageSet.includes(value) ? value : 'overview';
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(readPage);
  const [userId, setUserId] = useState<string | null>(() => {
    const stored = window.localStorage.getItem('sigmapay-user-id');
    return stored && stored !== 'demo-user' ? stored : null;
  });
  useEffect(() => {
    const syncPage = () => setCurrentPage(readPage());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    return undefined;
  }, [currentPage]);

  const navigate = (page: Page) => {
    if (page === 'auth') {
      setUserId(null);
      window.localStorage.removeItem('sigmapay-user-id');
    }
    if (window.location.hash !== `#/${page}`) window.location.hash = `/${page}`;
    setCurrentPage(page);
  };

  const loginSuccess = (id: string) => {
    setUserId(id);
    window.localStorage.setItem('sigmapay-user-id', id);
    navigate('overview');
  };

  const section = currentPage === 'overview' ? (
    <OverviewPage onNavigate={navigate} />
  ) : currentPage === 'auth' ? (
    <div className="auth-stage"><AuthPage onLoginSuccess={loginSuccess} /></div>
  ) : userId ? (
    currentPage === 'features' ? <FeatureHubPage userId={userId} /> : <div className={`module-page module-${currentPage}`}>
      {currentPage === 'budgets' && <BudgetPage userId={userId} />}
      {currentPage === 'goals' && <GoalsPage userId={userId} />}
      {currentPage === 'reports' && <ReportsPage userId={userId} />}
      {currentPage === 'profile' && <ProfilePage userId={userId} />}
      {currentPage === 'payments' && <PaymentsPage />}
      {currentPage === 'groups' && <GroupSavingsPage userId={userId} />}
      {currentPage === 'bills' && <BillsPage userId={userId} />}
      {currentPage === 'notifications' && <NotificationsPage userId={userId} />}
    </div>
  ) : (
    <div className="signed-out-state"><span className="eyebrow">SIGMAPAY WORKSPACE</span><h1>Sign in to continue</h1><p>Your account gives you access to budgets, goals, bills, and reports.</p><button className="button-primary" onClick={() => navigate('auth')}>Sign in to your account</button></div>
  );

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header currentPage={currentPage} onNavigate={navigate} userId={userId} />
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>{pageTitles[currentPage]}</strong></div>
          <div className="topbar-meta"><span className="workspace-status"><span className="status-dot" /> Personal workspace</span></div>
        </header>
        <main id="main-content" className="main-content page-transition" key={currentPage}>
          {section}
        </main>
        <footer className="app-footer"><span>SigmaPay</span><span>Planning tools for a clearer view of your money.</span><nav aria-label="Legal"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></nav></footer>
      </div>
    </div>
  );
};

export default App;
