import React from 'react';
import { ArrowDownRight, ArrowUpRight, ChartLineUp, CirclesThreePlus, Compass, CreditCard, Receipt, Target, Wallet } from '@phosphor-icons/react';
import FinanceVector from '../components/FinanceVector';
import { Page } from '../components/Header';

interface OverviewPageProps {
  onNavigate: (page: Page) => void;
}

const journeys: Array<{ page: Page; title: string; text: string; icon: React.ElementType; className: string }> = [
  { page: 'budgets', title: 'Plan a month', text: 'Set limits by category and keep spending in view.', icon: Wallet, className: 'journey-plan' },
  { page: 'goals', title: 'Build a goal', text: 'Choose a target and track each contribution.', icon: Target, className: 'journey-goal' },
  { page: 'bills', title: 'Stay ahead of bills', text: 'Keep due dates and repeat schedules together.', icon: Receipt, className: 'journey-bills' },
];

const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => (
  <div className="overview-page">
    <section className="overview-hero" aria-labelledby="welcome-title">
      <div className="overview-copy">
        <span className="overview-kicker"><span className="live-pulse" /> Your local money workspace</span>
        <h1 id="welcome-title">See the whole picture.<br /><span>Choose your next move.</span></h1>
        <p>Plan what matters, stay on top of everyday spending and make progress toward the things you care about.</p>
        <div className="hero-actions">
          <button className="button-primary" type="button" onClick={() => onNavigate('budgets')}><Wallet size={17} weight="fill" /> Open your budget</button>
          <button className="button-secondary" type="button" onClick={() => onNavigate('reports')}>Explore your activity <ArrowDownRight size={17} /></button>
        </div>
        <div className="overview-trust"><span><i className="trust-check">✓</i> Demo data only</span><span><i className="trust-check">✓</i> No real payments</span></div>
      </div>
      <div className="overview-art">
        <FinanceVector kind="overview" title="Money flows from income to a budget, a savings goal, and bills" />
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /></div>
    </section>

    <section className="workspace-section" aria-labelledby="workspace-heading">
      <div className="section-title-row">
        <div><span className="section-kicker">Start where you are</span><h2 id="workspace-heading">What do you want to work on?</h2></div>
        <span className="session-tag"><span className="status-dot" /> Local session</span>
      </div>
      <div className="journey-grid">
        {journeys.map(({ page, title, text, icon: Icon, className }) => (
          <button key={page} className={`journey-card ${className}`} type="button" onClick={() => onNavigate(page)}>
            <span className="journey-icon"><Icon size={23} weight="duotone" /></span>
            <span className="journey-copy"><strong>{title}</strong><small>{text}</small></span>
            <span className="journey-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
          </button>
        ))}
      </div>
    </section>

    <section className="tools-section" aria-labelledby="tools-heading">
      <div className="section-title-row">
        <div><span className="section-kicker">Your financial toolkit</span><h2 id="tools-heading">One place for the details</h2></div>
        <button className="text-link" type="button" onClick={() => onNavigate('payments')}>View all tools <ArrowUpRight size={16} /></button>
      </div>
      <div className="tool-rail">
        <button type="button" onClick={() => onNavigate('payments')}><span className="rail-icon rail-blue"><CreditCard size={19} /></span><span><b>Payments</b><small>Simulated checkout</small></span><ArrowUpRight size={16} /></button>
        <button type="button" onClick={() => onNavigate('reports')}><span className="rail-icon rail-green"><ChartLineUp size={19} /></span><span><b>Reports</b><small>Income & spending</small></span><ArrowUpRight size={16} /></button>
        <button type="button" onClick={() => onNavigate('groups')}><span className="rail-icon rail-amber"><CirclesThreePlus size={19} /></span><span><b>Group savings</b><small>Shared goals</small></span><ArrowUpRight size={16} /></button>
        <button type="button" onClick={() => onNavigate('notifications')}><span className="rail-icon rail-lilac"><Compass size={19} /></span><span><b>Alerts</b><small>Local preferences</small></span><ArrowUpRight size={16} /></button>
      </div>
    </section>

    <aside className="demo-disclosure"><span className="disclosure-mark">i</span><div><strong>Built for exploring</strong><p>This workspace uses temporary local demo data. Payments, identity checks, email delivery and Supabase storage are not connected.</p></div></aside>
  </div>
);

export default OverviewPage;
