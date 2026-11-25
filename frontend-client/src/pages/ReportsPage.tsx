import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface ReportsPageProps { userId: string; }
const ReportsPage: React.FC<ReportsPageProps> = ({ userId }) => {
  const [report, setReport] = useState('');
  const [reportType, setReportType] = useState<'monthly' | 'income' | 'spending'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async (type: 'monthly' | 'income' | 'spending') => {
    setLoading(true); setReportType(type); setMessage('');
    const result = await apiClient.generateReport(userId, type, startDate || undefined, endDate || undefined);
    setReport(result.success ? result.report || '' : '');
    setMessage(result.success ? 'Generated from transactions recorded in this demo session.' : result.message || 'Could not generate the report.');
    setLoading(false);
  };

  const exportCsv = async () => {
    const result = await apiClient.exportReport(userId, reportType, startDate || undefined, endDate || undefined);
    if (!result.ok) { setMessage('Report export is unavailable. Generate a report after recording activity.'); return; }
    const url = URL.createObjectURL(await result.blob());
    const link = document.createElement('a'); link.href = url; link.download = `sigmapay-${reportType}-report.csv`; link.click(); URL.revokeObjectURL(url);
    setMessage('CSV report downloaded.');
  };

  return <div className="workflow-page">
    <div className="module-heading"><div><span className="eyebrow">UNDERSTAND YOUR ACTIVITY</span><h1>Reports</h1></div><p>Generate summaries and export them from the activity in your current demo session.</p></div>
    <div className="report-options">
      <button className={`report-option ${reportType === 'monthly' ? 'is-selected' : ''}`} type="button" onClick={() => generate('monthly')}><span className="eyebrow">01 / ACTIVITY</span><strong>Activity summary</strong><small>Income and spending over a selected date range.</small></button>
      <button className={`report-option ${reportType === 'income' ? 'is-selected' : ''}`} type="button" onClick={() => generate('income')}><span className="eyebrow">02 / CASH FLOW</span><strong>Income statement</strong><small>Income, expense totals and net amount.</small></button>
      <button className={`report-option ${reportType === 'spending' ? 'is-selected' : ''}`} type="button" onClick={() => generate('spending')}><span className="eyebrow">03 / CATEGORIES</span><strong>Spending report</strong><small>Recorded expenses grouped by category.</small></button>
    </div>
    <section className="workflow-panel report-result"><div className="panel-heading"><span className="eyebrow">CUSTOM REPORT</span><h2>Select a date range</h2></div><div className="form-two-column report-date-range"><label>From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>Through<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label></div><div className="report-actions"><button className="button-primary" type="button" disabled={loading || (!!startDate && !!endDate && startDate > endDate)} onClick={() => generate(reportType)}>{loading ? 'Generating…' : 'Generate selected report'}</button><button className="button-outline" type="button" onClick={exportCsv} disabled={!report || loading}>Export CSV</button></div><div className="panel-heading report-subheading"><span className="eyebrow">{report ? reportType.toUpperCase() : 'READY WHEN YOU ARE'}</span><h2>{report ? (reportType === 'monthly' ? 'Activity summary' : reportType === 'income' ? 'Income statement' : 'Spending by category') : 'Report preview'}</h2></div>{loading ? <p>Building your report…</p> : report ? <pre className="report-output">{report}</pre> : <div className="empty-state"><strong>Your report will appear here</strong><p>First add activity in Budgets. The demo does not include sample balances.</p></div>}{message && <p className="inline-message" role="status">{message}</p>}</section>
  </div>;
};

export default ReportsPage;
