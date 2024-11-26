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
