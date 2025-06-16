import axios from 'axios';

export const getGDP = async (countryCode) => {
  const res = await axios.get(`https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json`);
  return res.data[1];
};

export const getInflation = async (countryCode) => {
  // World Bank inflation indicator code: FP.CPI.TOTL.ZG (Consumer Price Index annual %)
  const res = await axios.get(`https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json`);
  return res.data[1];
};
