import React, { useEffect, useState } from 'react';
import Header, { Page } from './components/Header';
import FinanceVector, { IllustrationKind } from './components/FinanceVector';
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
const pageIllustrations: Record<Exclude<Page, 'auth'>, { kind: IllustrationKind; title: string; description: string }> = {
  overview: { kind: 'overview', title: 'Your money, in focus.', description: 'A clear place to plan, make progress and understand the choices ahead.' },
  budgets: { kind: 'budgets', title: 'Give every plan a number.', description: 'Create a spending plan, then record expenses against its categories.' },
  goals: { kind: 'goals', title: 'Make progress visible.', description: 'Set a target and deadline, then follow the amount still to go.' },
  groups: { kind: 'groups', title: 'Build toward something together.', description: 'Create a savings circle, invite members and record contributions.' },
  bills: { kind: 'bills', title: 'Keep bills on schedule.', description: 'Add bills, review due dates and schedule recurring payments in the sandbox.' },
  payments: { kind: 'payments', title: 'Payments in a safe sandbox.', description: 'Explore the payment flow with simulated methods and no real money.' },
  reports: { kind: 'reports', title: 'See the story in your activity.', description: 'Review income and spending summaries based on recorded demo data.' },
  features: { kind: 'reports', title: 'Explore your financial toolkit.', description: 'Learn, review illustrative information, and see which services are available.' },
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
  useEffect(() => {
    const syncPage = () => setCurrentPage(readPage());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pointerFrame = 0;
    let scrollFrame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const drawPointer = () => {
      root.style.setProperty('--cursor-x', `${pointerX}px`);
      root.style.setProperty('--cursor-y', `${pointerY}px`);
      pointerFrame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(drawPointer);
    };
    const updateScrollProgress = () => {
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const progress = maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      root.style.setProperty('--scroll-progress', `${progress}`);
      root.style.setProperty('--hero-shift', reducedMotion.matches ? '0px' : `${Math.min(34, window.scrollY * 0.045)}px`);
      scrollFrame = 0;
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    };

    if (finePointer.matches && !reducedMotion.matches) window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    const motionRoot = document.querySelector<HTMLElement>('#main-content');
    const revealTargets = motionRoot?.querySelectorAll<HTMLElement>(
      '.overview-page > section, .overview-page > .demo-disclosure, .module-page > .module-intro, .workflow-page > .module-heading, .workflow-page > .budget-overview, .workflow-page > .workflow-grid, .workflow-page > .report-options',
    );
    let observer: IntersectionObserver | null = null;
    if (!reducedMotion.matches && revealTargets?.length && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    }

    revealTargets?.forEach((target) => {
      target.classList.add('scroll-reveal');
      if (observer) observer.observe(target);
      else target.classList.add('is-visible');
    });

    return () => {
      observer?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
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
      <section className="module-intro">
        <div className="module-intro-copy">
          <span className="section-kicker">SigmaPay · {currentPage === 'groups' ? 'Group savings' : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</span>
          <h1>{pageIllustrations[currentPage].title}</h1>
          <p>{pageIllustrations[currentPage].description}</p>
        </div>
        <FinanceVector kind={pageIllustrations[currentPage].kind} title={`${currentPage} illustration`} />
      </section>
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
      <div className="ambient-cursor" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header currentPage={currentPage} onNavigate={navigate} userId={userId} />
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>PERSONAL FINANCE</span><span aria-hidden="true">/</span><strong>{currentPage === 'auth' ? 'Account access' : currentPage === 'overview' ? 'Overview' : pageIllustrations[currentPage].title.replace(/[.]/g, '')}</strong></div>
          <div className="topbar-meta"><span className="local-demo-chip"><span className="demo-chip-icon">D</span> Local demo</span></div>
        </header>
        <main id="main-content" className="main-content page-transition" key={currentPage}>
          {section}
        </main>
        <footer className="app-footer"><span>SigmaPay</span><span>Planning tools for a clearer view of your money.</span></footer>
      </div>
    </div>
  );
};

export default App;
