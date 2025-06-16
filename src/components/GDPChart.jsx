import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getGDP, getInflation } from '../services/worldBank'; // You need to implement getInflation similarly
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import html2canvas from 'html2canvas';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const countryOptions = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "CN", name: "China" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "CA", name: "Canada" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
];

// Helper: Calculate linear regression for trendline
function linearRegression(y, x) {
  const n = y.length;
  const sum_x = x.reduce((a,b) => a+b, 0);
  const sum_y = y.reduce((a,b) => a+b, 0);
  const sum_xy = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sum_xx = x.reduce((acc, val) => acc + val * val, 0);
  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;
  return x.map(xi => slope * xi + intercept);
}

const GDPChart = () => {
  const [selectedCountries, setSelectedCountries] = useState(['IN']);
  const [dataType, setDataType] = useState('GDP'); // 'GDP' or 'Inflation'
  const [dataSets, setDataSets] = useState([]);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const allData = await Promise.all(
          selectedCountries.map(async (code) => {
            let rawData = [];
            if (dataType === 'GDP') {
              rawData = await getGDP(code);
            } else {
              rawData = await getInflation(code);
            }

            if (!rawData || rawData.length === 0) {
              throw new Error(`No ${dataType} data found for ${code}`);
            }

            const cleaned = rawData
              .filter(item => item.value !== null)
              .map(item => ({
                date: item.date,
                value: dataType === 'GDP' ? item.value / 1e12 : item.value, // GDP in trillions, Inflation raw percent
              }))
              .reverse();

            return { code, data: cleaned };
          })
        );

        // Find common years (intersection of years)
        const yearsArray = allData.map(d => d.data.map(item => item.date));
        const commonYears = yearsArray.reduce((a, b) => a.filter(c => b.includes(c)));

        // Build datasets for chart
        const datasets = allData.map(({ code, data }, idx) => {
          // Filter data to common years only
          const filteredData = data.filter(d => commonYears.includes(d.date));
          const yValues = filteredData.map(d => d.value);

          // Create trendline values
          const xValues = filteredData.map(d => parseInt(d.date));
          const trendValues = linearRegression(yValues, xValues);

          const colors = [
            '#00b894', '#0984e3', '#d63031', '#fd79a8', '#e17055',
            '#6c5ce7', '#00cec9', '#fdcb6e', '#55efc4', '#a29bfe'
          ];

          return [
            {
              label: `${dataType} of ${code}`,
              data: yValues,
              borderColor: colors[idx % colors.length],
              backgroundColor: colors[idx % colors.length] + '33',
              fill: true,
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: `${code} Trendline`,
              data: trendValues,
              borderColor: colors[idx % colors.length],
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0,
              tension: 0,
            }
          ];
        }).flat();

        setLabels(commonYears);
        setDataSets(datasets);
      } catch (e) {
        setError(e.message || 'Failed to fetch data.');
        setLabels([]);
        setDataSets([]);
      }
    };

    fetchData();
  }, [selectedCountries, dataType]);

  const chartData = {
    labels,
    datasets: dataSets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 14 } },
        position: 'bottom',
      },
      title: {
        display: true,
        text: `Historical ${dataType} Data`,
        color: 'white',
        font: { size: 32, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: context => {
            const val = context.raw;
            if (dataType === 'GDP') {
              return `GDP: $${val.toFixed(2)} T`;
            }
            return `Inflation: ${val.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: {
          display: true,
          text: 'Year',
          color: 'white',
          font: { size: 16 },
        },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: {
          display: true,
          text: dataType === 'GDP' ? 'Trillions USD' : 'Percentage (%)',
          color: 'white',
          font: { size: 16 },
        },
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const exportChart = async () => {
    const chartArea = document.getElementById('gdp-chart-area');
    if (chartArea) {
      const canvas = await html2canvas(chartArea);
      const link = document.createElement('a');
      link.download = `${dataType}_${selectedCountries.join('_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Handle multi-select countries
  const toggleCountry = (code) => {
    setSelectedCountries(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code);
      }
      return [...prev, code];
    });
  };

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0d1b2a', color: 'white', textAlign: 'center' }}
    >
      <h2 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '2rem' }}>
        📊 GDP & Inflation Chart Viewer
      </h2>

      <div className="mb-6 flex flex-wrap justify-center gap-4 max-w-xl">
        {countryOptions.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => toggleCountry(code)}
            className={`px-4 py-2 rounded cursor-pointer border-2 ${
              selectedCountries.includes(code)
                ? 'bg-green-600 border-green-500 text-white'
                : 'border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {name} ({code})
          </button>
        ))}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setDataType(dataType === 'GDP' ? 'Inflation' : 'GDP')}
className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-red font-semibold shadow-md transition duration-300"
        >
          Toggle to {dataType === 'GDP' ? 'Inflation' : 'GDP'}
        </button>
      </div>

      {error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <div
          id="gdp-chart-area"
          style={{
            width: '100%',
            maxWidth: '1200px',
            padding: '1.5rem',
            backgroundColor: '#1b263b',
            borderRadius: '1rem',
            boxShadow: '0 0 20px rgba(0, 184, 148, 0.5)',
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <button
        onClick={exportChart}
        className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-500 rounded text-blue"
      >
        📥 Download Chart as PNG
      </button>
    </div>
  );
};

export default GDPChart;
