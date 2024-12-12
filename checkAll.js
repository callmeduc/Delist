import axios from "axios";
import { RSI, MACD, BollingerBands, OBV, ADX } from "technicalindicators";
import cfg from "./utils/cfg.json" assert { type: "json" };

const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";
const INTERVAL = "1h";
const RSI_PERIOD = 14;
const EMA_PERIOD_SHORT = 12;
const EMA_PERIOD_LONG = 26;
const BB_PERIOD = 20;
const ADX_PERIOD = 14;
const CMF_PERIOD = 20; // Thời gian cho Chaikin Money Flow

// Hàm lấy dữ liệu nến từ Binance
const getKlines = async (symbol, interval, limit = 100) => {
  try {
    const response = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit },
    });
    return response.data.map((kline) => ({
      close: parseFloat(kline[4]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      volume: parseFloat(kline[5]),
    }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return [];
  }
};

// Hàm lấy giá hiện tại
const getCurrentPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price`,
      {
        params: { symbol },
      }
    );
    return parseFloat(response.data.price);
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error.message);
    return null;
  }
};

// Hàm tính mức hỗ trợ/kháng cự
const calculateSupportResistance = (klines) => {
  const highs = klines.map((k) => k.high);
  const lows = klines.map((k) => k.low);
  const closePrices = klines.map((k) => k.close);

  // Mức kháng cự là giá cao nhất trong khoảng thời gian
  const resistance = Math.max(...highs);
  // Mức hỗ trợ là giá thấp nhất trong khoảng thời gian
  const support = Math.min(...lows);
  // Tính Pivot Point
  const pivotPoint =
    (Math.max(...highs) +
      Math.min(...lows) +
      closePrices[closePrices.length - 1]) /
    3;

  return { support, resistance, pivotPoint };
};

// Hàm tính Chaikin Money Flow
const calculateCMF = (klines, period) => {
  const moneyFlow = klines.map((kline) => {
    const high = kline.high;
    const low = kline.low;
    const close = kline.close;
    const volume = kline.volume;

    const moneyFlowMultiplier = (close - low - (high - close)) / (high - low);
    return moneyFlowMultiplier * volume;
  });

  const cmf = [];
  for (let i = period - 1; i < moneyFlow.length; i++) {
    const sumMoneyFlow = moneyFlow
      .slice(i - period + 1, i + 1)
      .reduce((a, b) => a + b, 0);
    const sumVolume = klines
      .slice(i - period + 1, i + 1)
      .reduce((a, b) => a + b.volume, 0);
    cmf.push(sumMoneyFlow / sumVolume);
  }

  return cmf;
};

const analyzeMarket = async (symbol) => {
  const klines = await getKlines(symbol, INTERVAL);

  if (klines.length < RSI_PERIOD) {
    console.log(`Not enough data to calculate indicators for ${symbol}`);
    return;
  }

  const closes = klines.map((k) => k.close);
  const { support, resistance, pivotPoint } =
    calculateSupportResistance(klines);

  // Lấy giá hiện tại của coin
  const currentPrice = await getCurrentPrice(symbol);

  // RSI
  const rsi = RSI.calculate({ values: closes, period: RSI_PERIOD });
  const latestRSI = rsi[rsi.length - 1];

  // MACD
  const macdInput = {
    values: closes,
    fastPeriod: EMA_PERIOD_SHORT,
    slowPeriod: EMA_PERIOD_LONG,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  };
  const macd = MACD.calculate(macdInput);
  const latestMACD = macd[macd.length - 1];

  // Bollinger Bands
  const bb = BollingerBands.calculate({
    values: closes,
    period: BB_PERIOD,
    stdDev: 2,
  });
  const latestBB = bb[bb.length - 1];

  // OBV (On-Balance Volume)
  const obv = OBV.calculate({
    close: closes,
    volume: klines.map((k) => k.volume),
  });
  const latestOBV = obv[obv.length - 1];

  // ADX (Average Directional Index)
  const adx = ADX.calculate({
    high: klines.map((k) => k.high),
    low: klines.map((k) => k.low),
    close: closes,
    period: ADX_PERIOD,
  });
  const latestADX = adx[adx.length - 1];

  // Chaikin Money Flow
  const cmf = calculateCMF(klines, CMF_PERIOD);
  const latestCMF = cmf[cmf.length - 1];

  // Lọc tín hiệu yếu bằng ngưỡng MACD Histogram và OBV
  let signal = "";
  const strongTrend = latestADX.adx > 25;

  // Kết hợp các chỉ báo khối lượng với điều kiện tín hiệu
  if (latestRSI < 30 && latestCMF > 0 && strongTrend) {
    signal = "Strong Buy Signal (Oversold + Positive CMF + Strong Trend)";
  } else if (latestRSI > 70 && latestCMF < 0 && strongTrend) {
    signal = "Strong Sell Signal (Overbought + Negative CMF + Strong Trend)";
  } else if (latestMACD.MACD > latestMACD.signal && strongTrend) {
    signal = "Up_";
  } else if (latestMACD.MACD < latestMACD.signal && strongTrend) {
    signal = "Down";
  }

  // Xác nhận tín hiệu với Bollinger Bands
  if (closes[closes.length - 1] > latestBB.upper && latestRSI > 72) {
    signal = "Potential Sell Signal (Overbought)";
  } else if (closes[closes.length - 1] < latestBB.lower && latestRSI < 29) {
    signal = "Potential Buy Signal (Oversold)";
  }

  if (signal) {
    const data = [
      new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      }),
      symbol,
      currentPrice ? currentPrice.toFixed(2) : "N/A", // Thêm giá hiện tại vào kết quả
      latestRSI.toFixed(2),
      latestMACD.histogram.toFixed(2),
      latestBB.lower.toFixed(2),
      latestBB.upper.toFixed(2),
      latestOBV.toFixed(2),
      latestADX.adx.toFixed(2),
      latestCMF.toFixed(2),
      support.toFixed(2),
      resistance.toFixed(2),
      pivotPoint.toFixed(2),
      signal,
    ];
    return data;
  } else {
    // console.log(`No significant signal for ${symbol}`);
  }
};

const analyzeTrace = async () => {
  const promises = cfg.SYMBOLS.map(analyzeMarket);
  const datas = await Promise.all(promises);
  const data = datas.filter((item) => item !== undefined);
  return data;
};

export default analyzeTrace;
