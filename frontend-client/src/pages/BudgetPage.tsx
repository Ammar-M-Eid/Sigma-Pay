import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface BudgetPageProps { userId: string; }
type Budget = { budgetId: string; totalAmount: { amount: number }; startDate: string; endDate: string; categories: string[]; spent: number };
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

const BudgetPage: React.FC<BudgetPageProps> = ({ userId }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [trends, setTrends] = useState<Array<{ category: string; amount: number }>>([]);
  const [total, setTotal] = useState('');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState('');
  const [categories, setCategories] = useState('Food, Transport, Housing, Other');
  const [expense, setExpense] = useState('');
  const [category, setCategory] = useState('Food');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [budgetResponse, trendResponse] = await Promise.all([apiClient.getBudgets(userId), apiClient.getBudgetTrends(userId)]);
    setBudgets(budgetResponse.budgets || []);
    setTrends(trendResponse.trends || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const createBudget = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedCategories = categories.split(',').map((value) => value.trim()).filter(Boolean);
    const result = await apiClient.createBudget(userId, Number(total), start, end, parsedCategories);
    setMessage(result.success ? 'Budget saved for this demo session.' : result.message || 'Could not create budget.');
    if (result.success) { setTotal(''); await refresh(); }
  };

  const recordExpense = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await apiClient.recordExpense(userId, Number(expense), category, new Date().toISOString(), 'demo');
    setMessage(result.success ? 'Expense added to your demo activity.' : result.message || 'Could not record expense. Create a budget first.');
    if (result.success) { setExpense(''); await refresh(); }
  };

  const checkAlerts = async () => {
    const result = await apiClient.checkBudgetAlerts(userId, 80);
    if (result.success && result.alerts?.length) {
      const preferences = await apiClient.getNotificationPreferences(userId);
      if (preferences.preferences?.budget !== false) {
        await Promise.all(result.alerts.map((alert: { budgetId: string; spent: number; total: number }) => apiClient.sendAlert(userId, `Budget alert: plan ${alert.budgetId} has used ${Math.round(alert.spent / alert.total * 100)}% of its limit.`)));
      }
    }
    setMessage(result.success ? `${(result.alerts || []).length} budget alert${(result.alerts || []).length === 1 ? '' : 's'} at or above 80%.` : 'Could not check budget alerts.');
  };

  return <div className="workflow-page">
    <div className="module-heading"><div><span className="eyebrow">PLAN & TRACK</span><h1>Budgets</h1></div><p>Set a time-bound spending limit, then record expenses against its categories.</p></div>
    <section className="budget-overview" aria-label="Budget overview">
      <div><span>ACTIVE PLANS</span><strong>{budgets.length}</strong></div>
      <div><span>PLANNED TOTAL</span><strong>{money(budgets.reduce((sum, item) => sum + (item.totalAmount?.amount || 0), 0))}</strong></div>
      <div><span>RECORDED SPENDING</span><strong>{money(budgets.reduce((sum, item) => sum + (item.spent || 0), 0))}</strong></div>
      <button className="button-outline" type="button" onClick={checkAlerts}>Check alerts</button>
    </section>
    <div className="workflow-grid">
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">NEW PLAN</span><h2>Create a budget</h2></div>
        <form className="bill-form" onSubmit={createBudget}>
          <label>Budget amount<input type="number" min="0.01" step="0.01" value={total} onChange={(event) => setTotal(event.target.value)} required placeholder="0.00" /></label>
          <div className="form-two-column"><label>Starts<input type="date" value={start} onChange={(event) => setStart(event.target.value)} required /></label><label>Ends<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} required /></label></div>
          <label>Categories, separated by commas<input value={categories} onChange={(event) => setCategories(event.target.value)} required /></label>
          <p className="form-disclaimer">Budgets and expense history are temporary and reset when the service restarts.</p>
          <button className="button-primary" type="submit">Save budget</button>
        </form>
      </section>
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">ACTIVITY</span><h2>Record an expense</h2></div>
        <form className="bill-form" onSubmit={recordExpense}>
          <label>Amount<input type="number" min="0.01" step="0.01" value={expense} onChange={(event) => setExpense(event.target.value)} required placeholder="0.00" /></label>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{Array.from(new Set(budgets.flatMap((budget) => budget.categories || []).concat(['Food', 'Transport', 'Housing', 'Other', 'Income']))).map((item) => <option key={item}>{item}</option>)}</select></label>
          <p className="form-disclaimer">Expenses update a current budget. Income is recorded for reports without counting against spending limits.</p>
          <button className="button-primary" type="submit">Add expense</button>
        </form>
      </section>
    </div>
    <section className="workflow-panel budget-list-panel"><div className="panel-heading panel-heading-row"><div><span className="eyebrow">YOUR PLANS</span><h2>Budget progress</h2></div><button className="button-quiet" type="button" onClick={refresh}>Refresh</button></div>
      {loading ? <p className="empty-state">Loading budgets…</p> : budgets.length === 0 ? <div className="empty-state"><strong>No budgets yet</strong><p>Create a plan to track category spending and receive threshold alerts.</p></div> : <ul className="budget-list">{budgets.map((budget) => {
        const amount = budget.totalAmount?.amount || 0; const spent = budget.spent || 0; const percent = amount ? Math.min(100, spent / amount * 100) : 0;
        return <li key={budget.budgetId} className="budget-row"><div className="budget-row-title"><div><strong>{money(spent)} <span>of {money(amount)}</span></strong><small>{new Date(budget.startDate).toLocaleDateString()} — {new Date(budget.endDate).toLocaleDateString()}</small></div><b>{Math.round(percent)}%</b></div><div className="budget-progress"><span style={{ width: `${percent}%` }} /></div><small>{(budget.categories || []).join(' · ')}</small></li>;
      })}</ul>}
      {trends.length > 0 && <div className="trend-list"><h3>Spending by category</h3>{trends.map((trend) => <div key={trend.category}><span>{trend.category}</span><strong>{money(trend.amount)}</strong></div>)}</div>}
    </section>
    {message && <p className="inline-message" role="status">{message}</p>}
  </div>;
};

export default BudgetPage;
