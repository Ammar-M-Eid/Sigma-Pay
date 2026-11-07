import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface ProfilePageProps { userId: string; }
type LoginEvent = { at: string; device: string; ip: string; status: string };
const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const [email, setEmail] = useState(''); const [phone, setPhone] = useState(''); const [address, setAddress] = useState('');
  const [newUsername, setNewUsername] = useState(''); const [oldPassword, setOldPassword] = useState(''); const [newPassword, setNewPassword] = useState('');
  const [activity, setActivity] = useState<LoginEvent[]>([]); const [twoFactor, setTwoFactor] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [verifyCode, setVerifyCode] = useState(''); const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    const [accountResult, activityResult] = await Promise.all([apiClient.getAccount(userId), apiClient.getLoginActivity(userId)]);
    const account = accountResult.account;
    if (account?.profile) { setEmail(account.profile.email || ''); setPhone(account.profile.phone || ''); setAddress(account.profile.address || ''); }
    setTwoFactor(Boolean(account?.securitySettings?.twoFactorEnabled)); setActivity(activityResult.activity || []);
  }, [userId]);
  useEffect(() => { refresh(); }, [refresh]);

  const submitProfile = async (event: React.FormEvent) => { event.preventDefault(); const result = await apiClient.updateAccount(userId, email, phone, address); setMessage(result.message || (result.success ? 'Profile updated.' : 'Could not update profile.')); };
  const submitUsername = async (event: React.FormEvent) => { event.preventDefault(); const result = await apiClient.changeUsername(userId, newUsername); setMessage(result.message || (result.success ? 'Username updated.' : 'Could not change username.')); if (result.success) setNewUsername(''); };
  const submitPassword = async (event: React.FormEvent) => { event.preventDefault(); const result = await apiClient.changePassword(userId, oldPassword, newPassword); setMessage(result.message || (result.success ? 'Password changed.' : 'Password change failed.')); if (result.success) { setOldPassword(''); setNewPassword(''); } };
  const toggleTwoFactor = async () => { const result = twoFactor ? await apiClient.disableTwoFactor(userId) : await apiClient.enableTwoFactor(userId, 'authenticator'); setMessage(result.message || 'Security setting updated.'); if (result.success) { setTwoFactor(!twoFactor); if (!twoFactor) { setVerifyCode(''); setDemoCode(result.demoCode || ''); } else setDemoCode(''); } };
  const verifyIdentity = async (event: React.FormEvent) => { event.preventDefault(); const result = await apiClient.verifyIdentity(userId, verifyCode, 'email'); setMessage(result.message || (result.success ? 'Demo identity verified.' : 'Identity verification failed.')); if (result.success) setVerifyCode(''); };

  return <div className="workflow-page">
    <div className="module-heading"><div><span className="eyebrow">ACCOUNT & SECURITY</span><h1>Profile</h1></div><p>Review your demo account details, password settings, two-step sign-in and recent access activity.</p></div>
    <div className="workflow-grid profile-grid">
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">YOUR DETAILS</span><h2>Profile information</h2></div><form className="bill-form" onSubmit={submitProfile}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Phone number<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label><label>Address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Optional" /></label><button className="button-primary" type="submit">Save profile</button></form></section>
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">SIGN-IN</span><h2>Update username</h2></div><form className="bill-form" onSubmit={submitUsername}><label>New username<input value={newUsername} onChange={(event) => setNewUsername(event.target.value)} minLength={3} maxLength={20} required /></label><button className="button-outline" type="submit">Change username</button></form><div className="profile-divider" /><div className="panel-heading"><h2>Change password</h2></div><form className="bill-form" onSubmit={submitPassword}><label>Current password<input type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required /></label><label>New password<input type="password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /><small className="form-disclaimer">Use at least 12 characters with a number and a symbol.</small></label><button className="button-primary" type="submit">Update password</button></form></section>
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">ACCOUNT PROTECTION</span><h2>Two-step sign-in</h2></div><p className="profile-copy">{twoFactor ? 'Two-step sign-in is enabled in this demo account.' : 'Add a second verification step to the demo sign-in flow.'}</p><button className={twoFactor ? 'button-outline' : 'button-primary'} type="button" onClick={toggleTwoFactor}>{twoFactor ? 'Turn off two-step sign-in' : 'Enable two-step sign-in'}</button>{twoFactor && demoCode && <p className="demo-code">Demo sign-in code <strong>{demoCode}</strong></p>}{twoFactor && <p className="form-disclaimer">This sample code is for the local demo only; there is no real authentication provider.</p>}</section>
      <section className="workflow-panel"><div className="panel-heading"><span className="eyebrow">DEMO ONLY</span><h2>Identity check</h2></div><p className="profile-copy">Identity checks are simulated. Do not enter government or banking information.</p><form className="bill-form" onSubmit={verifyIdentity}><label>Sample verification code<input inputMode="numeric" value={verifyCode} onChange={(event) => setVerifyCode(event.target.value)} required minLength={6} /></label><button className="button-outline" type="submit">Verify sample code</button></form></section>
    </div>
    <section className="workflow-panel activity-panel"><div className="panel-heading panel-heading-row"><div><span className="eyebrow">RECENT ACCESS</span><h2>Login activity</h2></div><button className="button-quiet" type="button" onClick={refresh}>Refresh</button></div>{activity.length === 0 ? <div className="empty-state"><strong>No sign-in events yet</strong><p>Successful and failed attempts will appear here for this service session.</p></div> : <ul className="activity-list">{activity.slice().reverse().map((item, index) => <li key={`${item.at}-${index}`}><span className={`activity-state ${item.status === 'Success' ? 'activity-ok' : 'activity-failed'}`} /><div><strong>{item.status === 'Success' ? 'Sign-in successful' : 'Sign-in attempt failed'}</strong><small>{item.device} · {item.ip}</small></div><time dateTime={item.at}>{new Date(item.at).toLocaleString()}</time></li>)}</ul>}</section>
    {message && <p className="inline-message" role="status">{message}</p>}
  </div>;
};

export default ProfilePage;
