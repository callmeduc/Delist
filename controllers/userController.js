import asyncHandler from "express-async-handler";
import { styleCSS } from "../utils/template.js";
import cfg from "../utils/cfg.json" assert { type: "json" };
import analyzeMarket from "../analyzeMarket.js";

import { DOMAIN_URL } from "../utils/config.js";

const home = asyncHandler(async (req, res) => {
  try {
    res.send("Home page ... in delist project.");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

const test = asyncHandler(async (req, res) => {
  try {
    console.log("This is a test... in delist project.");
    res.send("This is a test... in delist project.");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const name = asyncHandler(async (req, res) => {
  try {
    res.send(`
    <h3>Nhập Danh Sách Name</h3>
    <form method="POST" action="/name">
      <input type="text" name="name" placeholder="Nhập tên: BTCUSDT" required />
      <button type="submit">SEND</button>
    </form>
  `);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const analyzeMarkets = asyncHandler(async (req, res) => {
  try {
    const time = (req.query.time || "1h").trim();
    const data = await analyzeMarket(time);
    let i = 1;
    const bodySend = `
${styleCSS}
<h3>
<a href="${DOMAIN_URL}/market?time=2h">Nhập </a>
<a href="${DOMAIN_URL}/market?time=4h">Danh </a>
<a href="${DOMAIN_URL}/market?time=8h">Sách </a>
<a href="${DOMAIN_URL}/market?time=12h">Name </a>
</h3>
    <form method="POST" action="/name">
      <input type="text" name="name" placeholder="Nhập tên: BTCUSDT" required />
      <button type="submit">SEND</button>
    </form>

<table class="responsive-table">
  <thead>
    <tr>
      <th><a href="${DOMAIN_URL}/market">#</a></th>
      <th>${time}</th>
      <th>Pair</th>
      <th>RSI</th>
      <th>MACD</th>
      <th>CMF</th>
      <th>OBV</th>
      <th>Price</th>
      <th>Trend</th>
    </tr>
  </thead>
  <tbody>
  ${data
    .map(
      (x) => `
    <tr style="color: ${
      x[2] > 72 && x[3] < 0
        ? "red"
        : x[2] < 29 && x[3] > 0
        ? "#15d115"
        : "black"
    }">
      <td data-label="#">${i++}</td>
      <td data-label="Time">${x[0]}</td>
      <td data-label="Pair">${x[1]}</td>
      <td data-label="RSI" style="color: ${
        x[2] > 72 ? "red" : x[2] < 29 ? "#15d115" : "black"
      }">${x[2]}</td>
      <td data-label="MACD">${x[3]}</td>
      <td data-label="CMF">${x[4]}</td>
      <td data-label="OBV">${x[5]}</td>
      <td data-label="Price">${x[6]}</td>
      <td data-label="Trend">${x[7]}</td>
    </tr>`
    )
    .join("")}
  </tbody>
</table>

    `;

    return res.send(bodySend);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const handleName = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const SYMBOL = name.toUpperCase().trim();
    let result = "Pls check again ";
    if (SYMBOL) {
      if (cfg.SYMBOLS.includes(SYMBOL)) {
        cfg.SYMBOLS = cfg.SYMBOLS.filter((item) => item !== SYMBOL);
        result = `Đã xóa ${SYMBOL} rồi.`;
      } else {
        cfg.SYMBOLS.push(SYMBOL);
        result = `Đã thêm ${SYMBOL} vào.`;
      }
    }
    const text =
      result +
      `  <a href="https://delist-lxqt.onrender.com/market?time=1h">MARKET!</a>`;

    res.send(text);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

export { home, test, name, handleName, analyzeMarkets };
