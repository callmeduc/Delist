// delist.js
import { writeToDoc } from "./utils/googleDocs.js";
import { chromium } from "playwright";
import sendEmail from "./utils/emailUtil.js";
import axios from "axios";
import cron from "node-cron";
import {
  DOC_DELIST_ID,
  ADDRESS,
  ANNOUNCE_URL,
  REQUEST_URL,
  CRON_SCHEDULE,
  CRON_MINUTE_FIX,
} from "./utils/config.js";

let browser;
let previousTitle = "";

async function initBrowser() {
  if (!browser || !browser.isConnected()) {
    console.log("Khởi chạy trình duyệt...");
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

async function checkAnnouncement(page) {
  try {
    await page.route("**/*", (route) => {
      const resourceType = route.request().resourceType();
      if (["stylesheet", "image", "font"].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(ANNOUNCE_URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    const announcement = await page
      .locator(".css-1q4wrpt > .css-1tl1y3y")
      .first();
    const firstChildDivText = await announcement.textContent();
    const title = firstChildDivText.slice(0, -10).trim();

    if (title !== previousTitle) {
      console.log("Thông báo mới:", title);
      const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      });
      const text = `${title} on ${ADDRESS}, at ${now}`;
      // await Promise.all([
      //   writeToDoc([text], DOC_DELIST_ID),
      //   sendEmail(text, title),
      // ]);
      await writeToDoc([text], DOC_DELIST_ID);
      previousTitle = title;
    } else {
      console.log("Không có thông báo mới.");
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra thông báo:", error);
  }
}

export async function handleDelist() {
  let page;
  try {
    const response = await axios.get(REQUEST_URL);
    console.log("PET - Request OK:", response.data);

    page = await (await initBrowser()).newPage();
    await checkAnnouncement(page);
  } catch (error) {
    console.error("Lỗi trong quá trình kiểm tra thông báo:", error);
  } finally {
    if (page) await page.close();
  }
}

// Lên lịch với cron
cron.schedule(CRON_SCHEDULE, handleDelist);
cron.schedule(CRON_MINUTE_FIX, handleDelist);

// Đảm bảo đóng trình duyệt khi ứng dụng thoát
process.on("exit", async () => {
  if (browser) {
    await browser.close();
    console.log("Trình duyệt đã được đóng.");
  }
});
