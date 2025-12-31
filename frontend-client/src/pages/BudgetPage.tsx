import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { BarChartComponent, ChartDataPoint } from '../components/Charts';

interface BudgetPageProps {
  userId: string;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ userId }) => {
  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState('Food,Transport,Entertainment,Shopping');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseMessage, setExpenseMessage] = useState('');
  const [expenseErrors, setExpenseErrors] = useState<{ [key: string]: string }>({});

  // Mock budget data for chart
  const [budgetChartData, setBudgetChartData] = useState<ChartDataPoint[]>([
    { name: 'Food', value: 300, allocated: 300, spent: 280 },
    { name: 'Transport', value: 150, allocated: 150, spent: 120 },
    { name: 'Entertainment', value: 200, allocated: 200, spent: 180 },
    { name: 'Shopping', value: 250, allocated: 250, spent: 200 },
  ]);

  const validateBudgetForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Total amount validation (positive number, max 1 million)
    if (!totalAmount.trim()) {
      newErrors.totalAmount = 'Total amount is required';
    } else if (isNaN(parseFloat(totalAmount))) {
      newErrors.totalAmount = 'Please enter a valid number';
    } else if (parseFloat(totalAmount) <= 0) {
      newErrors.totalAmount = 'Amount must be greater than 0';
    } else if (parseFloat(totalAmount) > 1000000) {
      newErrors.totalAmount = 'Amount cannot exceed $1,000,000';
    }

    // Start date validation
    if (!startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    // End date validation
    if (!endDate.trim()) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Categories validation (at least 1 category)
    if (!categories.trim()) {
      newErrors.categories = 'At least one category is required';
    } else if (categories.split(',').length > 20) {
      newErrors.categories = 'Maximum 20 categories allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExpenseForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Expense amount validation (positive, max 100k per transaction)
    if (!expenseAmount.trim()) {
      newErrors.expenseAmount = 'Amount is required';
    } else if (isNaN(parseFloat(expenseAmount))) {
      newErrors.expenseAmount = 'Please enter a valid number';
    } else if (parseFloat(expenseAmount) <= 0) {
      newErrors.expenseAmount = 'Amount must be greater than 0';
    } else if (parseFloat(expenseAmount) > 100000) {
      newErrors.expenseAmount = 'Single expense cannot exceed $100,000';
    }

    setExpenseErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBudgetForm()) {
      return;
    }

    const categoryList = categories.split(',').map(c => c.trim());
    const response = await apiClient.createBudget(
      userId,
      parseFloat(totalAmount),
      startDate,
      endDate,
      categoryList
    );

    if (response.success) {
      setMessage(`✅ Budget created successfully! Budget ID: ${response.budget?.budgetId}`);
      setTotalAmount('');
      setStartDate('');
      setEndDate('');
      setCategories('Food,Transport,Entertainment,Shopping');
    } else {
      setMessage('❌ Failed to create budget');
    }
  };

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateExpenseForm()) {
      return;
    }

    const response = await apiClient.recordExpense(
      userId,
      parseFloat(expenseAmount),
      expenseCategory,
      new Date().toISOString(),
      'card'
    );

    if (response.success) {
      setExpenseMessage('✅ Expense recorded successfully!');
      setExpenseAmount('');
    } else {
      setExpenseMessage('❌ Failed to record expense');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Budget Management</h1>

      {budgetChartData.length > 0 && (
        <div style={styles.chartSection}>
          <BarChartComponent
            data={budgetChartData}
            title="Budget Allocation vs Actual Spending"
            dataKey="allocated"
            color="#646cff"
          />
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.subtitle}>📋 Create Budget</h2>
        <form onSubmit={handleCreateBudget} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Total Amount ($)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => {
                setTotalAmount(e.target.value);
                if (errors.totalAmount) setErrors({ ...errors, totalAmount: '' });
              }}
              placeholder="e.g., 2000"
              style={{
                ...styles.input,
                ...(errors.totalAmount && styles.inputError),
              }}
              step="0.01"
              min="0"
            />
            <p style={styles.helperText}>Must be between $0.01 and $1,000,000</p>
            {errors.totalAmount && <p style={styles.errorText}>{errors.totalAmount}</p>}
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) setErrors({ ...errors, startDate: '' });
                }}
                style={{
                  ...styles.input,
                  ...(errors.startDate && styles.inputError),
                }}
              />
              {errors.startDate && <p style={styles.errorText}>{errors.startDate}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors({ ...errors, endDate: '' });
                }}
                style={{
                  ...styles.input,
                  ...(errors.endDate && styles.inputError),
                }}
              />
              {errors.endDate && <p style={styles.errorText}>{errors.endDate}</p>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categories (comma-separated)</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => {
                setCategories(e.target.value);
                if (errors.categories) setErrors({ ...errors, categories: '' });
              }}
              placeholder="e.g., Food, Transport, Entertainment"
              style={{
                ...styles.input,
                ...(errors.categories && styles.inputError),
              }}
            />
            <p style={styles.helperText}>Max 20 categories, comma-separated</p>
            {errors.categories && <p style={styles.errorText}>{errors.categories}</p>}
          </div>

          <button type="submit" style={styles.button}>
            📊 Create Budget
          </button>
        </form>
        {message && (
          <p style={{
            ...styles.message,
            ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </p>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>💳 Record Expense</h2>
        <form onSubmit={handleRecordExpense} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount ($)</label>
            <input
              type="number"
              value={expenseAmount}
              onChange={(e) => {
                setExpenseAmount(e.target.value);
                if (expenseErrors.expenseAmount)
                  setExpenseErrors({ ...expenseErrors, expenseAmount: '' });
              }}
              placeholder="e.g., 50.00"
              style={{
                ...styles.input,
                ...(expenseErrors.expenseAmount && styles.inputError),
              }}
              step="0.01"
              min="0"
            />
            <p style={styles.helperText}>Max $100,000 per transaction</p>
            {expenseErrors.expenseAmount && (
              <p style={styles.errorText}>{expenseErrors.expenseAmount}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              style={styles.input}
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            ➕ Record Expense
          </button>
        </form>
        {expenseMessage && (
          <p style={{
            ...styles.message,
            ...(expenseMessage.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {expenseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
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
  chartSection: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
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
    marginTop: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#fc8181',
    backgroundColor: '#fff5f5',
  },
  helperText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: '13px',
    color: '#c53030',
    marginTop: '6px',
    fontWeight: '500',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(100, 108, 255, 0.4)',
    transition: 'all 0.3s ease',
  },
  message: {
    marginTop: '20px',
    padding: '14px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
  },
  successMessage: {
    background: '#c6f6d5',
    color: '#22543d',
  },
  errorMessage: {
    background: '#fed7d7',
    color: '#742a2a',
  },
};

export default BudgetPage;
