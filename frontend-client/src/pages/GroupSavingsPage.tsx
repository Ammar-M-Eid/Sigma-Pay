import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface GroupSavingsPageProps {
  userId: string;
}

const GroupSavingsPage: React.FC<GroupSavingsPageProps> = ({ userId }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [addMemberGroupId, setAddMemberGroupId] = useState('');
  const [depositGroupId, setDepositGroupId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [reportGroupId, setReportGroupId] = useState('');
  const [report, setReport] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const membersList = members.split(',').map(m => m.trim());
    const response = await apiClient.createGroup(groupName, membersList);
    if (response.success && response.group) {
      setMessage(`Group created successfully! Group ID: ${response.group.groupId}`);
      setAddMemberGroupId(response.group.groupId);
      setDepositGroupId(response.group.groupId);
      setReportGroupId(response.group.groupId);
      setGroupName('');
      setMembers('');
    } else {
      setMessage('Failed to create group');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.addMemberToGroup(addMemberGroupId, memberId);
    setMessage(response.success ? 'Member added successfully!' : 'Failed to add member');
    if (response.success) {
      setMemberId('');
    }
  };

  const handleProcessDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.processGroupDeposit(depositGroupId, userId, parseFloat(depositAmount));
    setMessage(response.success ? 'Deposit processed successfully!' : 'Failed to process deposit');
    if (response.success) {
      setDepositAmount('');
    }
  };

  const handleGenerateReport = async () => {
    const response = await apiClient.getGroupReport(reportGroupId);
    if (response.success && response.report) {
      setReport(response.report);
    } else {
      setReport('Failed to generate report');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Group Savings</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Create Savings Group</h2>
        <form onSubmit={handleCreateGroup} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group Name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Members (comma-separated user IDs):</label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              required
              style={styles.input}
              placeholder="user1, user2, user3"
            />
          </div>
          <button type="submit" style={styles.button}>
            Create Group
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Add Member to Group</h2>
        <form onSubmit={handleAddMember} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group ID:</label>
            <input
              type="text"
              value={addMemberGroupId}
              onChange={(e) => setAddMemberGroupId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Member User ID:</label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Add Member
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Make Deposit</h2>
        <form onSubmit={handleProcessDeposit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group ID:</label>
            <input
              type="text"
              value={depositGroupId}
              onChange={(e) => setDepositGroupId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Deposit Amount ($):</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <button type="submit" style={styles.button}>
            Process Deposit
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Group Report</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Group ID:</label>
          <input
            type="text"
            value={reportGroupId}
            onChange={(e) => setReportGroupId(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleGenerateReport} style={styles.button}>
          Generate Group Report
        </button>
        {report && (
          <div style={styles.reportCard}>
            <pre style={styles.reportContent}>{report}</pre>
          </div>
        )}
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  section: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    animation: 'fadeInUp 0.5s ease',
  },
  subtitle: {
    color: '#2d3748',
    marginBottom: '24px',
    fontSize: '22px',
    fontWeight: '600',
    borderBottom: '3px solid #646cff',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  button: {
    padding: '16px',
    fontSize: '17px',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(100, 108, 255, 0.4)',
  },
  message: {
    marginTop: '24px',
    padding: '16px',
    background: 'linear-gradient(135deg, #b2ebf2 0%, #80deea 100%)',
    border: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.2)',
  },
  reportCard: {
    marginTop: '24px',
    padding: '24px',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.2)',
  },
  reportContent: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    margin: 0,
    color: '#2d3748',
  },
};

export default GroupSavingsPage;
