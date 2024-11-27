import axios from "axios";
import { BINANCE_API_URL } from "./config.js";

export const getKlines = async (symbol, interval, limit = 100) => {
  try {
    const response = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit },
    });

    const klines = response.data.map((kline) => ({
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));

    const currentPrice = klines[klines.length - 1]?.close || 0;

    return { klines, currentPrice };
  } catch (error) {
    console.error(`Error fetching data for ${symbol} from Binance:`, error);
    return { klines: [], currentPrice: 0 };
  }
};
