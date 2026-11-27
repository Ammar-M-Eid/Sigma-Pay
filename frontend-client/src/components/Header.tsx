import React, { useState } from 'react';
import { House, Wallet, Target, UsersThree, Receipt, CreditCard, ChartBar, Bell, UserCircle, Sparkle, X } from '@phosphor-icons/react';

export type Page = 'overview' | 'budgets' | 'goals' | 'groups' | 'bills' | 'payments' | 'reports' | 'features' | 'notifications' | 'profile' | 'auth';
interface HeaderProps { currentPage: Page; onNavigate: (page: Page) => void; userId: string | null; }

const groups = [
  { label: 'YOUR MONEY', items: [{ key: 'overview' as const, label: 'Overview', icon: House }, { key: 'budgets' as const, label: 'Budgets', icon: Wallet }, { key: 'goals' as const, label: 'Savings goals', icon: Target }, { key: 'groups' as const, label: 'Group savings', icon: UsersThree }] },
  { label: 'ACTIVITY', items: [{ key: 'bills' as const, label: 'Bills', icon: Receipt }, { key: 'payments' as const, label: 'Payments', icon: CreditCard }, { key: 'reports' as const, label: 'Reports', icon: ChartBar }] },
  { label: 'MORE', items: [{ key: 'features' as const, label: 'Explore', icon: Sparkle }, { key: 'notifications' as const, label: 'Notifications', icon: Bell }, { key: 'profile' as const, label: 'Profile', icon: UserCircle }] },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => {
  const [open, setOpen] = useState(false);
  const nav = (page: Page) => { onNavigate(page); setOpen(false); };
  return <>
    <button className="mobile-menu-button" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <span className="menu-glyph">☰</span>}</button>
    <aside className={`app-header ${open ? 'is-open' : ''}`}>
      <a className="brand" href="#/overview" onClick={() => nav('overview')} aria-label="SigmaPay home"><span className="brand-mark"><span /></span><span className="brand-name">sigma<span>pay</span></span></a>
      <div className="workspace-label"><span className="workspace-avatar">S</span><span><b>Personal space</b><small>Money management</small></span><span className="workspace-chevron">⌄</span></div>
      <nav className="side-nav" aria-label="Main navigation">
        {groups.map(group => <div className="nav-group" key={group.label}><span className="nav-group-label">{group.label}</span>{group.items.map(({ key, label, icon: Icon }) => <a key={key} className={`nav-link ${currentPage === key ? 'is-active' : ''}`} href={`#/${key}`} aria-current={currentPage === key ? 'page' : undefined} onClick={() => nav(key)}><Icon size={19} weight={currentPage === key ? 'fill' : 'regular'} /><span>{label}</span></a>)}</div>)}
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-support"><span className="support-orb"><Sparkle size={18} /></span><b>A little more clarity</b><p>Plan today around what matters to you.</p><button type="button" onClick={() => nav('features')}>Explore tools <span>↗</span></button></div><button className="account-switch" type="button" onClick={() => nav(userId ? 'profile' : 'auth')}><span className="account-avatar"><UserCircle size={21} /></span><span className="account-label"><strong>{userId ? 'Your account' : 'Sign in'}</strong><small>{userId ? 'Account settings' : 'Access your workspace'}</small></span><span className="account-arrow">↗</span></button></div>
    </aside>
    {open && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
  </>;
};
export default Header;
