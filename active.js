import axios from "axios";
import cron from "node-cron";
import { URL_ACTIVE, CRON_MINUTE_FIX3 } from "./utils/config.js";
export async function activeWeb() {
  try {
    const response = await axios.get(URL_ACTIVE);
    console.log(`Website gọi thành công: ${response.status}`);
  } catch (error) {
    console.error(`Lỗi khi gọi website: ${error.message}`);
  }
}

cron.schedule("*/7 * * * *", activeWeb);
