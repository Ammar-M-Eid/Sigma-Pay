import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface GoalsPageProps {
  userId: string;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ userId }) => {
  const [goalType, setGoalType] = useState('Savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Medium');
  const [message, setMessage] = useState('');

  // Progress tracking
  const [progressGoalId, setProgressGoalId] = useState('');
  const [progressData, setProgressData] = useState<any>(null);

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.createGoal(
      userId,
      goalType,
      parseFloat(targetAmount),
      deadline,
      priorityLevel
    );

    if (response.success && response.goal) {
      setMessage(`Goal created successfully! Goal ID: ${response.goal.goalId}`);
      setProgressGoalId(response.goal.goalId);
    } else {
      setMessage('Failed to create goal');
    }
  };

  const handleTrackProgress = async () => {
    if (!progressGoalId) {
      setMessage('Please create a goal first or enter a goal ID');
      return;
    }

    const response = await apiClient.trackProgress(userId, progressGoalId);
    if (response.success && response.progress) {
      setProgressData(response.progress);
    } else {
      setMessage('Failed to track progress');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Goals</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Set Financial Goal</h2>
        <form onSubmit={handleSetGoal} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Goal Type:</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              style={styles.input}
            >
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
              <option value="Emergency Fund">Emergency Fund</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Target Amount ($):</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Priority Level:</label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              style={styles.input}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>
            Set Goal
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Track Progress</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Goal ID:</label>
          <input
            type="text"
            value={progressGoalId}
            onChange={(e) => setProgressGoalId(e.target.value)}
            style={styles.input}
            placeholder="Enter goal ID or create a new goal"
          />
        </div>
        <button onClick={handleTrackProgress} style={styles.button}>
          Track Progress
        </button>
        
        {progressData && (
          <div style={styles.progressCard}>
            <h3>Progress Report</h3>
            <p><strong>Goal ID:</strong> {progressData.goalId}</p>
            <p><strong>Completion:</strong> {progressData.percentageComplete.toFixed(2)}%</p>
            <p><strong>Remaining Amount:</strong> ${progressData.remainingAmount.amount}</p>
            <p><strong>Days Remaining:</strong> {progressData.daysRemaining}</p>
            <p><strong>Status:</strong> {progressData.onTrack ? '✅ On Track' : '⚠️ Behind Schedule'}</p>
          </div>
        )}
      </div>
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
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.2)',
  },
  progressCard: {
    marginTop: '24px',
    padding: '24px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

export default GoalsPage;
