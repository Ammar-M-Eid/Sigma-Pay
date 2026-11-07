import React from 'react';
import { House, Wallet, Target, UsersThree, Receipt, CreditCard, ChartBar, Bell, UserCircle } from '@phosphor-icons/react';

export type Page = 'overview' | 'budgets' | 'goals' | 'groups' | 'bills' | 'payments' | 'reports' | 'notifications' | 'profile' | 'auth';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userId: string | null;
}

const navigation = [
  { key: 'overview' as const, label: 'Overview', icon: House },
  { key: 'budgets' as const, label: 'Budgets', icon: Wallet },
  { key: 'goals' as const, label: 'Goals', icon: Target },
  { key: 'groups' as const, label: 'Group savings', icon: UsersThree },
  { key: 'bills' as const, label: 'Bills', icon: Receipt },
  { key: 'payments' as const, label: 'Payments', icon: CreditCard },
  { key: 'reports' as const, label: 'Reports', icon: ChartBar },
  { key: 'notifications' as const, label: 'Notifications', icon: Bell },
  { key: 'profile' as const, label: 'Profile', icon: UserCircle },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => (
  <aside className="sidebar">
    <a className="brand" href="#/overview" onClick={() => onNavigate('overview')} aria-label="SigmaPay overview">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span className="brand-name">Sigma<span>Pay</span></span>
    </a>

    <div className="workspace-label">WORKSPACE</div>
    <nav className="side-nav" aria-label="Main navigation">
      {navigation.map(({ key, label, icon: Icon }) => (
        <a
          className={`nav-link ${currentPage === key ? 'is-active' : ''}`}
          href={`#/${key}`}
          key={key}
          aria-current={currentPage === key ? 'page' : undefined}
          onClick={() => onNavigate(key)}
        >
          <Icon className="nav-icon" size={17} weight="regular" aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>

    <div className="sidebar-spacer" />
    <div className="storage-note">
      <span className="status-dot" />
      <div><strong>Local demo</strong><small>Data resets with the backend</small></div>
    </div>
    <button className="account-switch" type="button" onClick={() => onNavigate(userId ? 'auth' : 'overview')}>
      <span className="account-avatar">{userId ? 'D' : '?'}</span>
      <span className="account-label"><strong>{userId ? 'Demo account' : 'Sign in'}</strong><small>{userId ? 'Switch account' : 'Access your account'}</small></span>
      <span className="account-arrow" aria-hidden="true">↗</span>
    </button>
  </aside>
);

export default Header;
