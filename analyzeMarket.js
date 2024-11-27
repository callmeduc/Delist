import dotenv from "dotenv";
import Promise from "bluebird";
import { RSI_PERIOD, DOC_API_ID } from "./utils/config.js";
import cfg from "./utils/cfg.json" assert { type: "json" };
import { getKlines } from "./utils/binance.js";
import { writeToDoc } from "./utils/googleDocs.js";
import {
  calculateRSI,
  calculateMACD,
  calculateCMF,
  calculateOBV,
} from "./utils/indicators.js";
dotenv.config();

const analyzeMarket = async (symbol, INTERVAL = "1h") => {
  const { klines, currentPrice } = await getKlines(symbol, INTERVAL);

  if (klines.length < RSI_PERIOD) {
    console.log(`Not enough data to calculate indicators for ${symbol}`);
    return;
  }

  const closes = klines.map((k) => k.close);

  const rsi = calculateRSI(closes);
  const latestRSI = rsi[rsi.length - 1];
  const macd = calculateMACD(closes);
  const latestMACD = macd[macd.length - 1];

  // Tính CMF và OBV
  const cmf = calculateCMF(klines);
  const obv = calculateOBV(klines);

  // Kiểm tra điều kiện RSI và MACD để đưa ra tín hiệu
  let signal = "";
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  if (latestRSI < 25 && latestMACD.histogram > 0) {
    signal = `${symbol} - Buy Signal (Oversold + Positive MACD)`;
    const text = `   At ${now}, ${signal} in API. With Price: ${currentPrice}, RSI: ${latestRSI}`;
    await writeToDoc([text], DOC_API_ID);
  } else if (latestRSI > 77 && latestMACD.histogram < 0) {
    signal = `${symbol} - Sell Signal (Overbought + Negative MACD)`;
    const text = `   At ${now}, ${signal} in API. With Price: ${currentPrice}, RSI: ${latestRSI}`;
    await writeToDoc([text], DOC_API_ID);
  } else if (latestMACD.MACD > latestMACD.signal && latestMACD.histogram > 0) {
    signal = "Up_";
  } else if (latestMACD.MACD < latestMACD.signal && latestMACD.histogram < 0) {
    signal = "Downtrend";
  }

  if (signal) {
    const data = [
      new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      }),
      symbol,
      latestRSI.toFixed(2),
      latestMACD.histogram.toFixed(2),
      cmf.toFixed(3),
      obv.toFixed(2),
      currentPrice.toFixed(3),
      signal,
    ];
    return data;
  } else {
    console.log(`No significant signal for ${symbol}`);
  }
};

// Hàm phân tích tất cả các thị trường
const analyzeAllMarkets = async (INTERVAL) => {
  const data = await Promise.map(
    cfg.SYMBOLS,
    (symbol) => analyzeMarket(symbol, INTERVAL),
    {
      concurrency: 5,
    }
  );

  return data;
};

export default analyzeAllMarkets;
