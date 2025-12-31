import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface PaymentsPageProps {
  userId: string;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ userId }) => {
  const [methodId, setMethodId] = useState('card');
  const [amount, setAmount] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [verifyMethodId, setVerifyMethodId] = useState('');
  const [CVV, setCVV] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [message, setMessage] = useState('');

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.processPayment(userId, methodId, parseFloat(amount), merchantId);
    setMessage(response.success ? 'Payment processed successfully!' : 'Failed to process payment');
    if (response.success) {
      setAmount('');
      setMerchantId('');
    }
  };

  const handleVerifyPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.verifyPaymentMethod(userId, verifyMethodId, CVV);
    setMessage(response.success ? 'Payment method verified!' : 'Failed to verify payment method');
    if (response.success) {
      setCVV('');
    }
  };

  const handleRequestRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.requestRefund(userId, transactionId, parseFloat(refundAmount), refundReason);
    setMessage(response.success ? 'Refund requested successfully!' : 'Failed to request refund');
    if (response.success) {
      setTransactionId('');
      setRefundAmount('');
      setRefundReason('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payments</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Process Payment</h2>
        <form onSubmit={handleProcessPayment} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method:</label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              style={styles.input}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount ($):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Merchant ID:</label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Process Payment
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Verify Payment Method</h2>
        <form onSubmit={handleVerifyPaymentMethod} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method ID:</label>
            <input
              type="text"
              value={verifyMethodId}
              onChange={(e) => setVerifyMethodId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CVV:</label>
            <input
              type="text"
              value={CVV}
              onChange={(e) => setCVV(e.target.value)}
              required
              style={styles.input}
              maxLength={4}
            />
          </div>
          <button type="submit" style={styles.button}>
            Verify Payment Method
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Request Refund</h2>
        <form onSubmit={handleRequestRefund} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Transaction ID:</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Refund Amount ($):</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason:</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              required
              style={{ ...styles.input, minHeight: '80px' }}
            />
          </div>
          <button type="submit" style={styles.button}>
            Request Refund
          </button>
        </form>
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
    background: 'linear-gradient(135deg, #ffccbc 0%, #ff8a65 100%)',
    border: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(255, 87, 34, 0.2)',
  },
};

export default PaymentsPage;
