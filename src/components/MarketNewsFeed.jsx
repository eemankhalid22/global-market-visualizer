import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { motion } from 'framer-motion';

const topics = [
  { label: 'Market', value: 'market' },
  { label: 'Finance', value: 'finance' },
  { label: 'Economy', value: 'economy' },
  { label: 'Technology', value: 'technology' },
];

const MarketNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  const fetchNews = async (topic) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `https://newsdata.io/api/1/news?apikey=pub_86799e82a087744c0c473a63cddc8bf879666&q=${topic}&language=en&category=business`
      );
      setNews(res.data.results?.slice(0, 6) || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedTopic.value);
  }, [selectedTopic]);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#1a2b45',
      color: 'white',
      borderColor: '#444',
    }),
    singleValue: (base) => ({ ...base, color: 'white' }),
    input: (base) => ({ ...base, color: 'white' }),
    menu: (base) => ({ ...base, backgroundColor: '#1a2b45', color: 'white' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#335577' : '#1a2b45',
      color: 'white',
    }),
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '24px' }}
    >
      <div className="max-w-4xl mx-auto">
<h4
  style={{ fontSize: '5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}
>
  📰 Market News Feed  

</h4>
        <p
  style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}
>
  Stay updated with the latest financial, market, and tech headlines

</p>

        <Select
          value={selectedTopic}
          onChange={setSelectedTopic}
          options={topics}
          styles={customStyles}
          className="mb-6"
        />

        {loading && <p className="animate-pulse text-white">Loading news...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading &&
            news.map((n, idx) => (
              <motion.div
                key={idx}
                className="bg-[#1e2a38] p-4 rounded-xl hover:shadow-lg transition-all flex gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                {n.image_url ? (
                  <img
                    src={n.image_url}
                    alt="thumbnail"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 text-white rounded-md">
                    📰
                  </div>
                )}
                <div className="flex-1">
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-semibold hover:underline"
                  >
                    {n.title}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.pubDate).toLocaleString()}
                  </p>
                  {n.description && (
                    <p className="text-sm text-gray-300 mt-2">
                      {n.description.slice(0, 90)}...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MarketNewsFeed;
