import { writeToDoc } from "./utils/googleDocs.js";
import { chromium } from "playwright";
import sendEmail from "./utils/emailUtil.js";
import axios from "axios";
import {
  DOC_DELIST_ID,
  ADDRESS,
  ANNOUNCE_URL,
  REQUEST_URL,
} from "./utils/config.js";

async function checkDelist() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let previousTitle = "";

  async function checkAnnouncement() {
    try {
      const firstChildDivText = await page
        .locator(".css-1q4wrpt > .css-1tl1y3y")
        .first()
        .innerText();

      const date = firstChildDivText.slice(-10).trim();
      const title = firstChildDivText.slice(0, -10).trim();

      if (title !== previousTitle && title.includes("Binance Will Delist")) {
        console.log("Text: ", firstChildDivText);
        console.log("Tiêu đề mới:", title);
        const now = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
        });
        const text = `${title} on ${ADDRESS}, at ${now}`;
        await Promise.all([
          writeToDoc([text], DOC_DELIST_ID),
          sendEmail(text, title),
        ]);
        previousTitle = title;
      } else {
        console.log("KHoong co thong bao moi");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  }

  await page.goto(ANNOUNCE_URL, { waitUntil: "domcontentloaded" });

  setInterval(async () => {
    try {
      const response = await axios.get(REQUEST_URL);
      console.log("DELIST - Request ok: ", response.data);
      await page.goto(ANNOUNCE_URL, {
        waitUntil: "domcontentloaded",
        timeout: 73333,
      });
      await checkAnnouncement();
    } catch (error) {
      console.error("Lỗi trong quá trình kiểm tra thông báo:", error);
    }
  }, 4 * 60 * 1000);
}

process.on("exit", async () => {
  await browser.close();
});

export default checkDelist;
