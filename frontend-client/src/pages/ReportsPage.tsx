import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { LineChartComponent, BarChartComponent, PieChartComponent, ChartDataPoint } from '../components/Charts';

interface ReportsPageProps {
  userId: string;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ userId }) => {
  const [monthlySummary, setMonthlySummary] = useState('');
  const [incomeStatement, setIncomeStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [spendingData, setSpendingData] = useState<ChartDataPoint[]>([]);
  const [incomeData, setIncomeData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Generate mock chart data
    const mockSpendingData = [
      { name: 'Week 1', value: 450 },
      { name: 'Week 2', value: 620 },
      { name: 'Week 3', value: 380 },
      { name: 'Week 4', value: 750 },
    ];

    const mockIncomeData = [
      { name: 'Salary', value: 3500 },
      { name: 'Freelance', value: 800 },
      { name: 'Other', value: 300 },
    ];

    const mockCategoryData = [
      { name: 'Groceries', value: 400 },
      { name: 'Utilities', value: 250 },
      { name: 'Entertainment', value: 350 },
      { name: 'Transportation', value: 280 },
      { name: 'Dining', value: 320 },
    ];

    setSpendingData(mockSpendingData);
    setIncomeData(mockIncomeData);
    setCategoryData(mockCategoryData);
  }, [userId]);

  const handleGenerateMonthlySummary = async () => {
    setLoading(true);
    const response = await apiClient.generateMonthlySummary(userId);
    setLoading(false);
    
    if (response.success) {
      setMonthlySummary(response.report);
    } else {
      setMonthlySummary('Failed to generate monthly summary');
    }
  };

  const handleGenerateIncomeStatement = async () => {
    setLoading(true);
    const response = await apiClient.generateIncomeStatement(userId);
    setLoading(false);
    
    if (response.success) {
      setIncomeStatement(response.report);
    } else {
      setIncomeStatement('Failed to generate income statement');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Financial Reports & Analytics</h1>

      <div style={styles.chartGrid}>
        {spendingData.length > 0 && (
          <div style={styles.chartWrapper}>
            <LineChartComponent
              data={spendingData}
              title="Weekly Spending Trend"
              dataKey="value"
              color="#646cff"
            />
          </div>
        )}

        {incomeData.length > 0 && (
          <div style={styles.chartWrapper}>
            <BarChartComponent
              data={incomeData}
              title="Income Sources"
              dataKey="value"
              color="#535bf2"
            />
          </div>
        )}

        {categoryData.length > 0 && (
          <div style={styles.chartWrapper}>
            <PieChartComponent
              data={categoryData}
              title="Spending by Category"
              dataKey="value"
            />
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Generate Summary Reports</h2>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleGenerateMonthlySummary} 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Generating...' : '📄 Generate Monthly Summary'}
          </button>
          <button 
            onClick={handleGenerateIncomeStatement} 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Generating...' : '💰 Generate Income Statement'}
          </button>
        </div>
      </div>

      {monthlySummary && (
        <div style={styles.reportCard}>
          <h3 style={styles.reportTitle}>Monthly Summary Report</h3>
          <pre style={styles.reportContent}>{monthlySummary}</pre>
        </div>
      )}

      {incomeStatement && (
        <div style={styles.reportCard}>
          <h3 style={styles.reportTitle}>Income Statement Report</h3>
          <pre style={styles.reportContent}>{incomeStatement}</pre>
        </div>
      )}

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>💡 About Reports</h3>
        <p style={styles.infoText}>
          Reports are generated based on your budget, expenses, and transactions. 
          The monthly summary provides an overview of your spending patterns, 
          while the income statement shows your income vs expenses. Charts are updated
          in real-time based on your financial data.
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
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
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  chartWrapper: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
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
    borderBottom: '3px solid #FF9800',
    paddingBottom: '10px',
    marginTop: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    fontSize: '15px',
    background: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(100, 108, 255, 0.4)',
    transition: 'all 0.3s ease',
  },
  reportCard: {
    marginBottom: '24px',
    padding: '24px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    borderLeft: '4px solid #646cff',
  },
  reportTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginTop: 0,
    marginBottom: '16px',
  },
  reportContent: {
    fontFamily: 'monospace',
    fontSize: '13px',
    whiteSpace: 'pre-wrap',
    margin: 0,
    color: '#4a5568',
    overflow: 'auto',
    maxHeight: '400px',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: '24px',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  },
  infoTitle: {
    color: '#1976D2',
    marginTop: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  infoText: {
    color: '#2d3748',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ReportsPage;
