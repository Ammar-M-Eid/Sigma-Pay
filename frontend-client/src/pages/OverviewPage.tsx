import React from 'react';
import FinancialScene from '../components/FinancialScene';
import { Page } from '../components/Header';

interface OverviewPageProps {
  onNavigate: (page: Page) => void;
}

const highlights: Array<{ page: Page; label: string; summary: string; index: string }> = [
  { page: 'budgets', label: 'Build a budget', summary: 'Set a monthly plan and record spending by category.', index: '01' },
  { page: 'goals', label: 'Create a goal', summary: 'Choose a target, deadline and priority, then follow progress.', index: '02' },
  { page: 'groups', label: 'Save with a group', summary: 'Create a shared savings circle and record contributions.', index: '03' },
];

const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => (
  <div className="overview-page">
    <FinancialScene kind="overview" title="Your money, in focus." description="A clear place to plan, make progress and understand the choices ahead." />

    <div className="section-heading start-heading">
      <div><span className="eyebrow">GET STARTED</span><h2>Make this workspace yours</h2></div>
      <p>These tools work in local demo mode. Only activity created during the current backend session is available.</p>
    </div>

    <div className="start-grid">
      {highlights.map(({ page, label, summary, index }) => (
        <button className="start-card" type="button" key={page} onClick={() => onNavigate(page)}>
          <span className="card-index">{index}</span>
          <span className="card-arrow" aria-hidden="true">↗</span>
          <strong>{label}</strong>
          <span>{summary}</span>
        </button>
      ))}
    </div>

    <div className="section-heading areas-heading">
      <div><span className="eyebrow">YOUR TOOLS</span><h2>Every part of the plan</h2></div>
    </div>
    <div className="tools-grid">
      {(['bills', 'payments', 'reports', 'notifications', 'profile'] as Page[]).map((page, i) => {
        const labels: Record<string, string> = { bills: 'Bills & schedules', payments: 'Payments', reports: 'Reports & insights', notifications: 'Notifications', profile: 'Account profile' };
        const descriptions: Record<string, string> = {
          bills: 'Manage bill details, due dates and recurring schedules.',
          payments: 'Try the payment sandbox, verification and refund flow.',
          reports: 'Review summaries generated from your recorded activity.',
          notifications: 'Set alert preferences and view local notifications.',
          profile: 'Review account details and security settings.',
        };
        return <button className="tool-link" key={page} type="button" onClick={() => onNavigate(page)}><span className="tool-number">0{i + 4}</span><span><strong>{labels[page]}</strong><small>{descriptions[page]}</small></span><span className="tool-arrow" aria-hidden="true">→</span></button>;
      })}
    </div>

    <div className="limits-note"><strong>Demo boundaries</strong><p>Authentication, payment processing, identity checks, notifications and Supabase storage are not production integrations. Never enter real financial or identity information.</p></div>
  </div>
);

export default OverviewPage;
