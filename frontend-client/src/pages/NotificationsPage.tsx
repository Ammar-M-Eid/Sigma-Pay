import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface NotificationsPageProps { userId: string; }
type Notification = { notificationId: string; message: string; timestamp: string; read: boolean; type: string };
const preferenceLabels: Record<string, string> = { budget: 'Budget threshold alerts', goals: 'Savings goal progress', payments: 'Payment reminders', email: 'Email delivery', sms: 'Text message delivery', push: 'Browser push delivery' };
const preferenceKeys = Object.keys(preferenceLabels);

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]); const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [alertMessage, setAlertMessage] = useState(''); const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    const [notificationResult, preferenceResult] = await Promise.all([apiClient.getNotifications(userId), apiClient.getNotificationPreferences(userId)]);
    setNotifications(notificationResult.notifications || []); setPreferences(preferenceResult.preferences || {});
  }, [userId]);
  useEffect(() => { refresh(); }, [refresh]);

  const sendAlert = async (event: React.FormEvent) => { event.preventDefault(); const result = await apiClient.sendAlert(userId, alertMessage); setMessage(result.success ? 'Alert added to this session.' : result.message || 'Could not add alert.'); if (result.success) { setAlertMessage(''); await refresh(); } };
  const togglePreference = async (key: string) => {
    const next = !(preferences[key] ?? true); const result = await apiClient.setNotificationPreference(userId, key, next);
    if (result.success) setPreferences((current) => ({ ...current, [key]: next }));
    else setMessage(result.message || 'Could not update preference.');
  };

  return <div className="workflow-page">
    <div className="module-heading"><div><span className="eyebrow">STAY INFORMED</span><h1>Notifications</h1></div><p>Review alerts generated during this session and choose which local alert categories are enabled.</p></div>
    <div className="workflow-grid">
      <section className="workflow-panel"><div className="panel-heading panel-heading-row"><div><span className="eyebrow">ACTIVITY FEED</span><h2>Recent notifications</h2></div><button className="button-quiet" type="button" onClick={refresh}>Refresh</button></div>{notifications.length === 0 ? <div className="empty-state"><strong>You’re all caught up</strong><p>Budget threshold events and alerts will appear here during this backend session.</p></div> : <ul className="notification-feed">{notifications.slice().reverse().map((item) => <li key={item.notificationId}><span className="notification-mark" /><div><div className="notification-meta"><span>{item.type}</span><time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString()}</time></div><p>{item.message}</p></div></li>)}</ul>}</section>
      <div className="notification-side"><section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">ALERT PREFERENCES</span><h2>Choose what you see</h2></div><ul className="preference-list">{preferenceKeys.map((key) => <li key={key}><span>{preferenceLabels[key]}<small>{key === 'email' || key === 'sms' || key === 'push' ? 'Delivery integrations are not connected in demo mode.' : 'Stored for this service session only.'}</small></span><button className={`toggle ${preferences[key] ?? true ? 'toggle-on' : ''}`} type="button" role="switch" aria-checked={preferences[key] ?? true} aria-label={`${preferenceLabels[key]} ${preferences[key] ?? true ? 'enabled' : 'disabled'}`} onClick={() => togglePreference(key)}><i /></button></li>)}</ul></section>
        <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">QUICK NOTE</span><h2>Add a reminder</h2></div><form className="bill-form" onSubmit={sendAlert}><label>Message<textarea value={alertMessage} onChange={(event) => setAlertMessage(event.target.value)} required maxLength={240} rows={3} placeholder="Write a reminder for this session" /></label><button className="button-outline" type="submit">Add local alert</button></form></section></div>
    </div>
    {message && <p className="inline-message" role="status">{message}</p>}
  </div>;
};

export default NotificationsPage;
