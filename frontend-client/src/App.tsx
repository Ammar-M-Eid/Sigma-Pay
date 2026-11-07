import React, { useEffect, useState } from 'react';
import Header, { Page } from './components/Header';
import FinancialScene, { SceneKind } from './components/FinancialScene';
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

const pageSet: Page[] = ['overview', 'budgets', 'goals', 'groups', 'bills', 'payments', 'reports', 'notifications', 'profile', 'auth'];
const sceneContent: Record<Exclude<Page, 'auth'>, { kind: SceneKind; title: string; description: string }> = {
  overview: { kind: 'overview', title: 'Your money, in focus.', description: 'A clear place to plan, make progress and understand the choices ahead.' },
  budgets: { kind: 'budgets', title: 'Give every plan a number.', description: 'Create a spending plan, then record expenses against its categories.' },
  goals: { kind: 'goals', title: 'Make progress visible.', description: 'Set a target and deadline, then follow the amount still to go.' },
  groups: { kind: 'groups', title: 'Build toward something together.', description: 'Create a savings circle, invite members and record contributions.' },
  bills: { kind: 'payments', title: 'Keep bills on schedule.', description: 'Add bills, review due dates and schedule recurring payments in the sandbox.' },
  payments: { kind: 'payments', title: 'Payments in a safe sandbox.', description: 'Explore the payment flow with simulated methods and no real money.' },
  reports: { kind: 'reports', title: 'See the story in your activity.', description: 'Review income and spending summaries based on recorded demo data.' },
  notifications: { kind: 'notifications', title: 'Choose what deserves your attention.', description: 'Manage local preferences and view alerts generated in this session.' },
  profile: { kind: 'profile', title: 'Your account, your settings.', description: 'Review profile details and demo account security controls.' },
};

function readPage(): Page {
  const value = window.location.hash.replace(/^#\/?/, '') as Page;
  return pageSet.includes(value) ? value : 'overview';
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(readPage);
  const [userId, setUserId] = useState<string | null>(() => window.localStorage.getItem('sigmapay-user-id') || 'demo-user');
  const [serviceState, setServiceState] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const syncPage = () => setCurrentPage(readPage());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    let mounted = true;
    fetch(`${baseUrl}/health`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('API unavailable')))
      .then((health) => { if (mounted) setServiceState(health.status === 'ok' ? 'online' : 'offline'); })
      .catch(() => { if (mounted) setServiceState('offline'); });
    return () => { mounted = false; };
  }, []);

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
    <div className={`module-page module-${currentPage}`}>
      <FinancialScene {...sceneContent[currentPage]} />
      {currentPage === 'budgets' && <BudgetPage userId={userId} />}
      {currentPage === 'goals' && <GoalsPage userId={userId} />}
      {currentPage === 'reports' && <ReportsPage userId={userId} />}
      {currentPage === 'profile' && <ProfilePage userId={userId} />}
      {currentPage === 'payments' && <PaymentsPage userId={userId} />}
      {currentPage === 'groups' && <GroupSavingsPage userId={userId} />}
      {currentPage === 'bills' && <BillsPage userId={userId} />}
      {currentPage === 'notifications' && <NotificationsPage userId={userId} />}
    </div>
  ) : (
    <div className="signed-out-state"><h1>Sign in to continue</h1><p>Your demo workspace is ready to use.</p><button className="button-primary" onClick={() => navigate('auth')}>Open sign in</button></div>
  );

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header currentPage={currentPage} onNavigate={navigate} userId={userId} />
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>PERSONAL FINANCE</span><span aria-hidden="true">/</span><strong>{currentPage === 'auth' ? 'Account access' : currentPage === 'overview' ? 'Overview' : sceneContent[currentPage].title.replace(/[.]/g, '')}</strong></div>
          <div className="topbar-status"><span className={`api-dot api-${serviceState}`} />{serviceState === 'online' ? 'Services online' : serviceState === 'checking' ? 'Checking services' : 'API offline'}</div>
        </header>
        <div className="demo-banner" role="status"><strong>Local demo</strong><span>Use sample information only. Data is temporary; payments and identity checks are simulations.</span></div>
        <main id="main-content" className="main-content" key={currentPage}>
          {section}
        </main>
        <footer className="app-footer"><span>SigmaPay</span><span>Planning tools for a clearer view of your money.</span></footer>
      </div>
    </div>
  );
};

export default App;
