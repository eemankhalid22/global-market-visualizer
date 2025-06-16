import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const countryData = [
  { country: 'India', gender: 0.72, sustainability: 0.55 },
  { country: 'USA', gender: 0.89, sustainability: 0.82 },
  { country: 'Germany', gender: 0.91, sustainability: 0.93 },
  { country: 'Maldives', gender: 0.68, sustainability: 0.71 },
  { country: 'Sweden', gender: 0.95, sustainability: 0.97 },
  { country: 'Nigeria', gender: 0.65, sustainability: 0.52 },
];

const GenderSustainabilityChart = () => {
  const [selected, setSelected] = useState(countryData);

  const handleChange = (selectedOptions) => {
    setSelected(countryData.filter(item =>
      selectedOptions.map(o => o.value).includes(item.country)
    ));
  };

  const options = countryData.map(c => ({
    value: c.country,
    label: c.country,
  }));

  const chartData = {
    labels: selected.map(d => d.country),
    datasets: [
      {
        label: 'Gender Index',
        data: selected.map(d => d.gender),
        backgroundColor: 'mediumvioletred',
        borderRadius: 5,
      },
      {
        label: 'Sustainability Index',
        data: selected.map(d => d.sustainability),
        backgroundColor: 'turquoise',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color:'rgba(255,255,255,0.1)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  return (
    <motion.div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{ backgroundColor: '#001f3f', color: 'white', padding: '2rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="mb-4 text-center">🌍 Gender & Sustainability Index</h2>

      <div className="mb-4" style={{ minWidth: '300px', width: '60%' }}>
        <Select
          isMulti
          options={options}
          onChange={handleChange}
          placeholder="Select countries..."
          defaultValue={options}
          styles={{
  control: (base) => ({
    ...base,
    backgroundColor: '#112233',
    color: 'white',
    borderColor: '#444',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#112233',
    color: 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#334455',
    color: 'white',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#335577' : '#112233',
    color: 'white',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#ccc',
  }),
}}

        />
      </div>

      <div className="card p-4 bg-dark rounded" style={{ width: '100%', maxWidth: '800px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export default GenderSustainabilityChart;
