import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartComponentProps {
  data: ChartDataPoint[];
  title: string;
  dataKey: string;
  color?: string;
}

interface BarChartComponentProps {
  data: ChartDataPoint[];
  title: string;
  dataKey: string;
  color?: string;
}

interface PieChartComponentProps {
  data: ChartDataPoint[];
  title: string;
  dataKey: string;
}

const COLORS = ['#087f77', '#e68a48', '#4f7180', '#b8a36a', '#8d79a5', '#6b9b8b'];

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  title,
  dataKey,
  color = '#087f77',
}) => {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  dataKey,
  color = '#e68a48',
}) => {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
  dataKey,
}) => {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: $${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chartContainer: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#17212b',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
};
