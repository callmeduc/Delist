import dotenv from "dotenv";
import Promise from "bluebird";
import {
  RSI_PERIOD,
  ADDRESS,
  INTERVAL,
  DOC_SIGNAL_ID,
  CRON_MARKET,
  CRON_MARKET_1,
  CRON_MARKET_2,
} from "./utils/config.js";
import cfg from "./utils/cfg.json" assert { type: "json" };
import { getKlines } from "./utils/binance.js";
import sendEmail from "./utils/emailUtil.js";
import {
  calculateRSI,
  calculateMACD,
  calculateCMF,
  calculateOBV,
} from "./utils/indicators.js";
import cron from "node-cron";
import Product from "./models/productModel.js";
import Name from "./models/nameModel.js";
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
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  if (latestRSI < 28 && latestMACD.histogram > 0 && cmf > 0) {
    signal = `${symbol} - Buy Signal (Oversold + Positive MACD)`;
    const text = `  At ${date}, ${signal} on ${ADDRESS}. With Price: ${currentPrice}, RSI: ${latestRSI}, MACD: ${latestMACD.histogram.toFixed(
      2
    )}, CMF: ${cmf.toFixed(2)}, OBV: ${obv.toFixed(2)}`;
    await Promise.all([
      writeToDoc([text], DOC_SIGNAL_ID),
      sendEmail(text, signal),
    ]);
  } else if (latestRSI > 73 && latestMACD.histogram < 0 && cmf < 0) {
    signal = `${symbol} - Sell Signal (Overbought + Negative MACD)`;
    const text = `  At ${date}, ${signal} on ${ADDRESS}. With Price: ${currentPrice}, RSI: ${latestRSI}, MACD: ${latestMACD.histogram.toFixed(
      2
    )}, CMF: ${cmf.toFixed(2)}, OBV: ${obv.toFixed(2)}`;
    await Promise.all([
      writeToDoc([text], DOC_SIGNAL_ID),
      sendEmail(text, signal),
    ]);
  } else if (latestMACD.MACD > latestMACD.signal && latestMACD.histogram > 0) {
    signal = "Up_";
  } else if (latestMACD.MACD < latestMACD.signal && latestMACD.histogram < 0) {
    signal = "Downtrend";
  }
  if (signal) {
    return {
      name: symbol,
      rsi: latestRSI.toFixed(2),
      macd: latestMACD.histogram.toFixed(2),
      cmf: cmf.toFixed(3),
      obv: Math.floor(obv),
      price: currentPrice.toFixed(3),
      signal,
    };
  } else {
    console.log(`No significant signal for ${symbol}`);
    return null;
  }
};

// Hàm phân tích tất cả các thị trường
const analyzeAllMarkets = async () => {
  const names = await Name.find();
  const nameList = names.map((entry) => entry.name) || cfg.SYMBOLS;
  const data = await Promise.map(nameList, (symbol) => analyzeMarket(symbol), {
    concurrency: 5,
  });
  // Lọc bỏ các tín hiệu null
  const result = data.filter((signal) => signal !== null);

  if (result.length > 0) {
    try {
      await Product.insertMany(result);
      console.log(`Inserted ${result.length} signals into database.`);
    } catch (err) {
      console.error("Error inserting signals into database:", err);
    }
  } else {
    console.log("No valid signals to insert.");
  }
};

cron.schedule(CRON_MARKET_1, analyzeAllMarkets);
// cron.schedule(CRON_MARKET, analyzeAllMarkets);
// cron.schedule(CRON_MARKET_2, analyzeAllMarkets);

export default analyzeAllMarkets;
