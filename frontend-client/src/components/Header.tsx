import React, { useState } from 'react';
import { House, Wallet, Target, UsersThree, Receipt, CreditCard, ChartBar, Bell, UserCircle, Sparkle } from '@phosphor-icons/react';

export type Page = 'overview' | 'budgets' | 'goals' | 'groups' | 'bills' | 'payments' | 'reports' | 'features' | 'notifications' | 'profile' | 'auth';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userId: string | null;
}

const navigationGroups = [
  { label: 'Workspace', items: [
    { key: 'overview' as const, label: 'Overview', icon: House },
  ] },
  { label: 'Plan your money', items: [
    { key: 'budgets' as const, label: 'Budgets', icon: Wallet },
    { key: 'goals' as const, label: 'Goals', icon: Target },
    { key: 'groups' as const, label: 'Group savings', icon: UsersThree },
    { key: 'bills' as const, label: 'Bills', icon: Receipt },
    { key: 'payments' as const, label: 'Payments', icon: CreditCard },
  ] },
  { label: 'Understand and learn', items: [
    { key: 'reports' as const, label: 'Reports', icon: ChartBar },
    { key: 'features' as const, label: 'Explore', icon: Sparkle },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
  ] },
  { label: 'Account', items: [
    { key: 'profile' as const, label: 'Profile', icon: UserCircle },
  ] },
];
const navigationOrder = navigationGroups.flatMap((group) => group.items.map((item) => item.key));

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="app-header">
    <a className="brand" href="#/overview" onClick={() => onNavigate('overview')} aria-label="SigmaPay overview">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span className="brand-name">sigma<span>pay</span></span>
    </a>

    <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
      <span /><span /><span />
    </button>

    <nav id="main-navigation" className={`side-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation" aria-hidden={!menuOpen && window.matchMedia('(max-width: 820px)').matches}>
      {navigationGroups.map((group) => <div className="nav-group" key={group.label}>
        <span className="nav-group-label">{group.label}</span>
        {group.items.map(({ key, label, icon: Icon }) => (
          <a
            className={`nav-link nav-link-order-${navigationOrder.indexOf(key)} ${currentPage === key ? 'is-active' : ''}`}
            href={`#/${key}`}
            key={key}
            aria-current={currentPage === key ? 'page' : undefined}
            onClick={() => { setMenuOpen(false); onNavigate(key); }}
          >
            <Icon className="nav-icon" size={18} weight={currentPage === key ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>)}
    </nav>

    <button className="account-switch" type="button" onClick={() => onNavigate(userId ? 'auth' : 'overview')}>
      <span className="account-avatar">{userId ? 'D' : '?'}</span>
      <span className="account-label"><strong>{userId ? 'Demo account' : 'Sign in'}</strong></span>
      <span className="account-arrow" aria-hidden="true">⌄</span>
    </button>
  </header>;
};

export default Header;
