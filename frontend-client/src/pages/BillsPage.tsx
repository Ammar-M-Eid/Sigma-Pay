import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface Bill {
  billId: string;
  provider: string;
  accountRef: string;
  amount: number;
  dueAt: string;
  recurring: boolean;
  status?: string;
}

interface BillsPageProps { userId: string; }

const BillsPage: React.FC<BillsPageProps> = ({ userId }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [provider, setProvider] = useState('');
  const [accountRef, setAccountRef] = useState('');
  const [amount, setAmount] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const response = await apiClient.getBills(userId);
    setBills(response.success && Array.isArray(response.bills) ? response.bills : []);
    if (!response.success) setMessage(response.message || 'Could not load bills. Check that the payment service is online.');
    setLoading(false);
  }, [userId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const result = await apiClient.createBill(userId, provider.trim(), accountRef.trim(), Number(amount), dueAt, recurring);
    setSaving(false);
    if (!result.success) {
      setMessage(result.message || 'The bill could not be saved.');
      return;
    }
    setProvider('');
    setAccountRef('');
    setAmount('');
    setDueAt('');
    setRecurring(false);
    setMessage('Bill saved in this local demo session.');
    await refresh();
  };

  const handlePay = async (bill: Bill) => {
    setMessage('');
    const result = await apiClient.payBill(bill.billId, userId);
    setMessage(result.message || (result.success ? 'Sandbox payment recorded.' : 'The bill could not be paid.'));
    if (result.success) await refresh();
  };

  return (
    <section className="workflow-page" aria-labelledby="bills-title">
      <div className="module-heading"><div><span className="eyebrow light-eyebrow">PAYMENTS / BILLS</span><h1 id="bills-title">Bills and recurring payments</h1></div><p>Keep due dates visible and set up a schedule for the demo flow.</p></div>
      <div className="workflow-grid">
        <form className="workflow-panel bill-form" onSubmit={handleCreate}>
          <div className="panel-heading"><span className="eyebrow">ADD A BILL</span><h2>Bill details</h2></div>
          <label>Provider<input value={provider} onChange={(event) => setProvider(event.target.value)} required maxLength={60} placeholder="Electricity, internet, rent" /></label>
          <label>Account reference<input value={accountRef} onChange={(event) => setAccountRef(event.target.value)} required maxLength={80} placeholder="Your provider reference" /></label>
          <div className="form-two-column"><label>Amount<input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label><label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} required /></label></div>
          <label className="check-row"><input type="checkbox" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} />Repeat this bill monthly</label>
          <button className="button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save bill'}</button>
          <p className="form-disclaimer">Payments are simulated. No real provider or bank is contacted.</p>
        </form>

        <section className="workflow-panel bill-list" aria-labelledby="bill-list-title">
          <div className="panel-heading panel-heading-row"><div><span className="eyebrow">DUE DATES</span><h2 id="bill-list-title">Your bills</h2></div><button className="button-quiet" type="button" onClick={() => void refresh()}>Refresh</button></div>
          {loading ? <div className="loading-lines" aria-label="Loading bills"><span /><span /><span /></div> : bills.length === 0 ? (
            <div className="empty-state"><strong>No bills added yet</strong><p>Add a bill to see its amount, due date and payment actions here.</p></div>
          ) : (
            <ul className="bill-items">
              {bills.map((bill) => <li key={bill.billId} className="bill-item">
                <div className="bill-monogram" aria-hidden="true">{bill.provider.slice(0, 1).toUpperCase()}</div>
                <div className="bill-info"><strong>{bill.provider}</strong><span>{bill.accountRef}</span><small>Due {new Date(bill.dueAt).toLocaleDateString()}</small></div>
                <div className="bill-value"><strong>{Number(bill.amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</strong><span>{bill.recurring ? 'Monthly' : 'One time'}</span></div>
                <button className="button-outline" type="button" onClick={() => void handlePay(bill)}>Pay in sandbox</button>
              </li>)}
            </ul>
          )}
          {message && <p className="inline-message" role="status">{message}</p>}
        </section>
      </div>
    </section>
  );
};

export default BillsPage;
