import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface GoalsPageProps { userId: string; }
type Goal = { goalId: string; goalType: string; targetAmount: { amount: number }; currentAmount: { amount: number }; deadline: string; priorityLevel: string; state: string };
const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);

const GoalsPage: React.FC<GoalsPageProps> = ({ userId }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalType, setGoalType] = useState('Emergency fund');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [contributions, setContributions] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    const result = await apiClient.getGoals(userId);
    setGoals(result.goals || []);
  }, [userId]);
  useEffect(() => { refresh(); }, [refresh]);

  const createGoal = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await apiClient.createGoal(userId, goalType, Number(target), deadline, priority);
    setMessage(result.success ? 'Savings goal created.' : result.message || 'Could not create goal.');
    if (result.success) { setTarget(''); await refresh(); }
  };

  const contribute = async (goalId: string) => {
    const amount = Number(contributions[goalId]);
    const result = await apiClient.contributeToGoal(goalId, userId, amount);
    setMessage(result.success ? 'Contribution recorded.' : result.message || 'Could not record contribution.');
    if (result.success) {
      const goal = goals.find((item) => item.goalId === goalId);
      if (goal) {
        const preferences = await apiClient.getNotificationPreferences(userId);
        if (preferences.preferences?.goals !== false) {
          const projected = (goal.currentAmount?.amount || 0) + amount;
          const isComplete = projected >= (goal.targetAmount?.amount || 0);
          await apiClient.sendAlert(userId, isComplete ? `Goal complete: ${goal.goalType} reached its target.` : `Goal update: ${goal.goalType} now has ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projected)} saved.`);
        }
      }
      setContributions((current) => ({ ...current, [goalId]: '' }));
      await refresh();
    }
  };

  const optimize = async () => {
    const result = await apiClient.getGoalRecommendations(userId, 12, true);
    const text = result.recommendation?.suggestions?.join(' ') || result.message || 'Recommendation unavailable.';
    setRecommendation(`${text} This is a sample planning suggestion, not a financial forecast.`);
  };

  return <div className="workflow-page">
    <div className="module-heading"><div><span className="eyebrow">SAVE WITH PURPOSE</span><h1>Savings goals</h1></div><p>Choose a target and date, then record contributions and follow your progress.</p></div>
    <div className="workflow-grid">
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">NEW TARGET</span><h2>Create a goal</h2></div>
        <form className="bill-form" onSubmit={createGoal}>
          <label>Goal name<input value={goalType} onChange={(event) => setGoalType(event.target.value)} required maxLength={60} /></label>
          <label>Target amount<input type="number" min="1" step="0.01" value={target} onChange={(event) => setTarget(event.target.value)} required placeholder="0.00" /></label>
          <div className="form-two-column"><label>Target date<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} required /></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
          <button className="button-primary" type="submit">Create goal</button>
        </form>
      </section>
      <section className="workflow-panel recommendation-panel"><div className="panel-heading"><span className="eyebrow">PLANNING ASSISTANT</span><h2>Find a steady pace</h2></div><p>Get a sample contribution suggestion based on a 12-month planning window. It does not connect to a bank or predict investment returns.</p><button className="button-outline" type="button" onClick={optimize}>Suggest a plan</button>{recommendation && <p className="inline-message" role="status">{recommendation}</p>}</section>
    </div>
    <section className="workflow-panel goals-list-panel"><div className="panel-heading panel-heading-row"><div><span className="eyebrow">YOUR PROGRESS</span><h2>Active goals</h2></div><button className="button-quiet" type="button" onClick={refresh}>Refresh</button></div>
      {goals.length === 0 ? <div className="empty-state"><strong>No goals yet</strong><p>Add a goal and make progress with each contribution.</p></div> : <div className="goal-grid">{goals.map((goal) => {
        const current = goal.currentAmount?.amount || 0; const targetAmount = goal.targetAmount?.amount || 0; const progress = targetAmount ? Math.min(100, current / targetAmount * 100) : 0;
        return <article key={goal.goalId} className="goal-card"><div className="goal-card-top"><div><span className="eyebrow">{goal.priorityLevel} PRIORITY</span><h3>{goal.goalType}</h3></div><span className="goal-status">{goal.state}</span></div><strong className="goal-amount">{formatMoney(current)} <span>of {formatMoney(targetAmount)}</span></strong><div className="budget-progress"><span style={{ width: `${progress}%` }} /></div><div className="goal-meta"><span>{Math.round(progress)}% complete</span><span>Target {new Date(goal.deadline).toLocaleDateString()}</span></div><div className="contribution-row"><label className="sr-only" htmlFor={`contribution-${goal.goalId}`}>Contribution amount for {goal.goalType}</label><input id={`contribution-${goal.goalId}`} type="number" min="0.01" step="0.01" placeholder="Amount" value={contributions[goal.goalId] || ''} onChange={(event) => setContributions((currentValues) => ({ ...currentValues, [goal.goalId]: event.target.value }))} /><button className="button-outline" type="button" onClick={() => contribute(goal.goalId)}>Add contribution</button></div></article>;
      })}</div>}
    </section>
    {message && <p className="inline-message" role="status">{message}</p>}
  </div>;
};

export default GoalsPage;
