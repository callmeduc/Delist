import { RSI, MACD } from "technicalindicators";
import { RSI_PERIOD, EMA_PERIOD_SHORT, EMA_PERIOD_LONG } from "./config.js";

export const calculateRSI = (closes) => {
  return RSI.calculate({ values: closes, period: RSI_PERIOD });
};

export const calculateMACD = (closes) => {
  return MACD.calculate({
    values: closes,
    fastPeriod: EMA_PERIOD_SHORT,
    slowPeriod: EMA_PERIOD_LONG,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
};
export const calculateCMF = (klines) => {
  let cmfSum = 0;
  let volumeSum = 0;

  klines.forEach((kline) => {
    const high = parseFloat(kline.high);
    const low = parseFloat(kline.low);
    const close = parseFloat(kline.close);
    const volume = parseFloat(kline.volume);

    const moneyFlowMultiplier = (close - low - (high - close)) / (high - low);
    const moneyFlowVolume = moneyFlowMultiplier * volume;

    cmfSum += moneyFlowVolume;
    volumeSum += volume;
  });

  return volumeSum !== 0 ? cmfSum / volumeSum : 0;
};

export const calculateOBV = (klines) => {
  let obv = 0;

  for (let i = 1; i < klines.length; i++) {
    const currentClose = parseFloat(klines[i].close);
    const previousClose = parseFloat(klines[i - 1].close);
    const volume = parseFloat(klines[i].volume);

    if (currentClose > previousClose) {
      obv += volume;
    } else if (currentClose < previousClose) {
      obv -= volume;
    }
  }

  return obv;
};
