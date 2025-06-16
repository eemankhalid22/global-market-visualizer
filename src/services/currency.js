import axios from 'axios';

const ACCESS_KEY = 'f73a6ae1e8e8c4e972f640ef6bf5bfda'; // your actual API key

export const convertCurrency = async (from, to, amount) => {
  try {
    const res = await axios.get('https://api.exchangeratesapi.io/v1/convert', {
      params: {
        access_key: ACCESS_KEY,
        from,
        to,
        amount
      }
    });
    
    if (res.data.success) {
      return res.data.result;
    } else {
      console.error("API error:", res.data.error);
      return null;
    }
  } catch (error) {
    console.error("Currency conversion error:", error);
    return null;
  }
};
