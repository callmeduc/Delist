import dotenv from "dotenv";
dotenv.config();

export const ANNOUNCE_URL = process.env.ANNOUNCE_URL;
export const REQUEST_URL = process.env.REQUEST_URL;
export const DOC_DELIST_ID = process.env.DOC_DELIST_ID;
export const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
export const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
export const ADDRESS = process.env.ADDRESS;

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const EMAIL = process.env.EMAIL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const CRON_SCHEDULE = "*/3 * * * *";
export const CRON_MINUTE_FIX = "1 * * * *";

export const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";
export const DOMAIN_URL = process.env.DOMAIN_URL || "https://delist-lxqt.onrender.com";
export const CRON_MARKET_1 = "10 * * * *";
export const CRON_MARKET_2 = "40 * * * *";

export const INTERVAL = "1h";
export const RSI_PERIOD = 14;
export const EMA_PERIOD_SHORT = 12;
export const EMA_PERIOD_LONG = 26;

export const DOCUMENT_ID = "19HjuDRmK0TNmky0_UcGMjK6LbWUG3WgAoJQ05hYLV6k";
export const DOC_SIGNAL_ID = "1RcokhuFsi5d1NYDEFQlR6q9vRWetsRyYjGfNP3VlfCs";
export const DOC_API_ID = "1FXYEc4W_E91khsYR7CdNh3KUds62p0hB493h2KX-NOM";
export const SHEET_ID = "1og75wlMJcAabnUDXxFHrF82sIyvA8v9iKyKYCMgleoY";