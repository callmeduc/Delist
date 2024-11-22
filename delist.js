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
} from "./utils/config.js";

let browser;
let previousTitle = "";

async function initBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

async function checkAnnouncement(page) {
  try {
    await page.goto(ANNOUNCE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const firstChildDivText = await page
      .locator(".css-1q4wrpt > .css-1tl1y3y")
      .first()
      .innerText();

    const date = firstChildDivText.slice(-10).trim();
    const title = firstChildDivText.slice(0, -10).trim();

    if (title !== previousTitle) {
      console.log("Text: ", firstChildDivText);
      console.log("Tiêu đề mới:", title);
      const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      });
      const text = `${title} on ${ADDRESS}, at ${now}`;
      // await Promise.all([
      //   writeToDoc([text], DOC_DELIST_ID),
      //   sendEmail(text, title),
      // ]);
      previousTitle = title;
    } else {
      console.log("Không có thông báo mới");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
  }
}

export async function handleDelist() {
  try {
    const response = await axios.get(REQUEST_URL);
    console.log("PET - Request OK: ", response.data);

    const page = await (await initBrowser()).newPage();
    await checkAnnouncement(page);
    await page.close();
  } catch (error) {
    console.error("Lỗi trong quá trình kiểm tra thông báo:", error);
  }
}

cron.schedule(CRON_SCHEDULE, handleDelist);

process.on("exit", async () => {
  if (browser) {
    await browser.close();
    console.log("Trình duyệt đã đóng khi thoát.");
  }
});
