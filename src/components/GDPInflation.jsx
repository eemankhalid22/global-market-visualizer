import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";

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
  { code: "RU", name: "Russia" },
  { code: "IT", name: "Italy" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "MX", name: "Mexico" },
  { code: "ID", name: "Indonesia" },
  { code: "NG", name: "Nigeria" },
  { code: "AR", name: "Argentina" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "TR", name: "Turkey" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "PL", name: "Poland" },
  { code: "EG", name: "Egypt" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "SG", name: "Singapore" },
  { code: "PK", name: "Pakistan" }
];

const GdpInflation = () => {
  const [countries, setCountries] = useState([""]);
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    const dataPerCountry = {};
    try {
      for (const code of countries.filter(c => c)) {
        const years = Array.from({ length: 10 }, (_, i) => 2022 - i).reverse();

        const gdpRes = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/NY.GDP.MKTP.CD?format=json&date=${years[0]}:${years[9]}`);
        const inflationRes = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/FP.CPI.TOTL.ZG?format=json&date=${years[0]}:${years[9]}`);

        const gdpJson = await gdpRes.json();
        const inflationJson = await inflationRes.json();

        if (!gdpJson[1] || !inflationJson[1]) throw new Error();

        dataPerCountry[code] = years.map(year => {
          const gdpEntry = gdpJson[1].find(item => item.date === String(year));
          const inflationEntry = inflationJson[1].find(item => item.date === String(year));
          return {
            year: String(year),
            GDP: gdpEntry?.value ? gdpEntry.value / 1e12 : null,
            Inflation: inflationEntry?.value ?? null,
          };
        });
      }
      setChartData(dataPerCountry);
    } catch {
      setError("❌ Invalid country code or missing data. Try IN, US, CN.");
      setChartData({});
    }
  };

  const handleCountryChange = (index, value) => {
    const updated = [...countries];
    updated[index] = value;
    setCountries(updated);
  };

  const addCountryField = () => {
    if (countries.length < 3) setCountries([...countries, ""]);
  };

  const exportChart = async () => {
    const chartDiv = document.getElementById("chart-container");
    if (chartDiv) {
      const canvas = await html2canvas(chartDiv);
      const link = document.createElement("a");
      link.download = "gdp-inflation-chart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const mergedYears = Array.from({ length: 10 }, (_, i) => (2022 - i).toString()).reverse();

  const combinedData = mergedYears.map(year => {
    const obj = { year };
    countries.forEach(code => {
      const entry = chartData[code]?.find(e => e.year === year);
      if (entry) {
        obj[`${code}_GDP`] = entry.GDP;
        obj[`${code}_Inflation`] = entry.Inflation;
      }
    });
    return obj;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h2
  style={{ fontSize: '5rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center' }}
>
        Global GDP & Inflation Visualizer
      </h2>

      <div className="mb-6 w-full max-w-2xl">
        {countries.map((selectedCode, i) => (
          <select
            key={i}
            value={selectedCode}
            onChange={(e) => handleCountryChange(i, e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded bg-gray-800 text-blue"
          >
            <option value="">Select Country {i + 1}</option>
            {countryOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {name} ({code})
              </option>
            ))}
          </select>
        ))}

        {countries.length < 3 && (
          <button
            onClick={addCountryField}
            className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            + Add Country
          </button>
        )}

        <button
          onClick={fetchData}
          className="w-full bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-blue"
        >
          Fetch Data
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {Object.keys(chartData).length > 0 && (
        <>
          <div id="chart-container" className="w-full max-w-5xl bg-gray-900 p-4 rounded-xl mb-6">
            <h3 className="text-xl font-semibold mb-2 text-center text-blue-300">Line Chart: GDP & Inflation Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4dabf7" />
                <XAxis dataKey="year" stroke="#ffffff" />
                <YAxis yAxisId="left" stroke="#ffffff" label={{ value: "GDP (T)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff" label={{ value: "Inflation (%)", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                {countries.map((code, i) => (
                  <Line key={i} yAxisId="left" dataKey={`${code}_GDP`} stroke="#4dabf7" strokeWidth={2} name={`${code} GDP`} />
                ))}
                {countries.map((code, i) => (
                  <Line key={i + "inflation"} yAxisId="right" dataKey={`${code}_Inflation`} stroke="#ff6b6b" strokeWidth={2} name={`${code} Inflation`} />
                ))}
              </LineChart>
            </ResponsiveContainer>

            <h3 className="text-xl font-semibold mt-8 mb-2 text-center text-blue-300">Bar Chart: GDP & Inflation Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4dabf7" />
                <XAxis dataKey="year" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Legend />
                {countries.map((code, i) => (
                  <Bar key={code + "_GDP"} dataKey={`${code}_GDP`} fill="#4dabf7" name={`${code} GDP`} />
                ))}
                {countries.map((code, i) => (
                  <Bar key={code + "_Inflation"} dataKey={`${code}_Inflation`} fill="#ff6b6b" name={`${code} Inflation`} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={exportChart}
            className="mt-6 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-blue mb-5"
          >
            📥 Download Chart as PNG
          </button>
        </>
      )}
    </div>
  );
};

export default GdpInflation;
