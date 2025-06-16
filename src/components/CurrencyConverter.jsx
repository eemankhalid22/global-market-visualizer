import { useState } from 'react';
import { convertCurrency } from '../services/currency';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const currencies = [
  'USD', 'EUR', 'INR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF', 'AED', 'SGD'
];

const CurrencyConverter = () => {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
  const res = await convertCurrency(from, to, amount);
  console.log('Conversion result:', res);

  if (res !== null && res !== undefined) {
    setResult(res);
  } else {
    alert("Conversion failed. Please check your inputs.");
  }
};


  const chartData = {
    labels: [from, to],
    datasets: [{
      label: 'Value',
      data: [1, result],
      backgroundColor: ['#4dabf7', '#00b894'],
      borderRadius: 6
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.2)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.2)' }
      }
    }
  };

  return (
    <motion.div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#0b2a4a',
        color: 'white',
        minHeight: '100vh',
        width: '100%',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-5 rounded" style={{ backgroundColor: '#0d3b66', width: '100%', maxWidth: 500 }}>
        <h2 className="text-center mb-4" style={{ color: '#fff' }}>💱 Currency Converter</h2>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control bg-dark text-white border-light"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="d-flex gap-3 mb-3">
          <div className="flex-fill">
            <label className="form-label">From</label>
            <select
              className="form-select bg-dark text-white border-light"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-fill">
            <label className="form-label">To</label>
            <select
              className="form-select bg-dark text-white border-light"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          className="btn btn-danger w-100"
          onClick={handleConvert}
        >
          🔄 Convert
        </button>

        {result && (
          <motion.div className="mt-4 text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <p className="fw-bold text-success">{amount} {from} = {result.toFixed(2)} {to}</p>
            <Bar data={chartData} options={chartOptions} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CurrencyConverter;
