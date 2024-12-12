import asyncHandler from "express-async-handler";
import analyzeMarket from "../analyzeMarket.js";
import analyzeTrace from "../checkAll.js";
import Product from "../models/productModel.js";
import cfg from "../utils/cfg.json" assert { type: "json" };
import {
  tableBody,
  tableWeekBody,
  styleCSS,
  tableTemplate,
  submitTable,
} from "../utils/template.js";
import { DOMAIN_URL, REQUEST_URL } from "../utils/config.js";

const home = asyncHandler(async (req, res) => {
  try {
    res.send("Service is running and analyzing ...");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

const test = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .limit(200);

    const table = tableBody(products);
    const buttonSubmit = submitTable(cfg.SYMBOLS);
    const bodySend = tableTemplate(table, buttonSubmit);

    res.send(bodySend);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const getProductByName = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .limit(100);
    res.json(products);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const getProducts = asyncHandler(async (req, res) => {
  try {
    const { name } = req.query;
    const SYMBOL = name || "BTCUSDT";
    const products = await Product.find({ name: SYMBOL })
      .sort({
        createdAt: -1,
      })
      .limit(200);

    const table = tableBody(products);
    const buttonSubmit = submitTable(cfg.SYMBOLS);
    const bodySend = tableTemplate(table, buttonSubmit);

    res.send(bodySend);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
const getProductByWeek = asyncHandler(async (req, res) => {
  try {
    const { name } = req.query;
    const SYMBOL = name || "BTCUSDT";
    const products = await Product.aggregate([
      {
        // Lọc các bản ghi theo tên
        $match: { name: SYMBOL },
      },
      {
        // Chuyển đổi thời gian sang ngày để nhóm dữ liệu theo ngày
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          rsi: 1,
          macd: 1,
          cmf: 1,
          obv: 1,
          price: 1,
          name: 1, // Giữ lại trường name
        },
      },
      {
        // Nhóm theo ngày và tính trung bình các giá trị
        $group: {
          _id: "$day",
          rsi: { $avg: "$rsi" },
          macd: { $avg: "$macd" },
          cmf: { $avg: "$cmf" },
          obv: { $avg: "$obv" },
          price: { $avg: "$price" },
          name: { $first: "$name" }, // Lấy tên đầu tiên trong nhóm
        },
      },
      {
        // Làm tròn các giá trị trung bình và sắp xếp lại các trường
        $project: {
          day: "$_id", // Giữ lại ngày
          name: 1, // Giữ lại trường name
          rsi: { $round: ["$rsi", 2] }, // Làm tròn đến 2 chữ số thập phân
          macd: { $round: ["$macd", 2] },
          cmf: { $round: ["$cmf", 2] },
          obv: { $round: ["$obv", 2] },
          price: { $round: ["$price", 2] },
        },
      },
      {
        // Sắp xếp kết quả theo ngày (từ mới nhất đến cũ nhất)
        $sort: { day: -1 },
      },
    ]);

    const table = tableWeekBody(products);
    const buttonSubmit = submitTable(cfg.SYMBOLS, "/week");
    const bodySend = tableTemplate(table, buttonSubmit);

    res.send(bodySend);
  } catch (err) {
    console.error(err);
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
      result + `  <a href="${DOMAIN_URL}/market?time=1h">MARKET!</a>`;

    res.send(text);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

const all = asyncHandler(async (req, res) => {
  try {
    const data = await analyzeTrace();
    let i = 1;
    const bodySend = `
${styleCSS}

<table class="responsive-table">
  <thead>
    <tr>
      <th>Time</th>
      <th>Pair</th>
      <th>Price</th>
      <th>RSI</th>
      <th>MACD</th>
      <th>Bollinger Lower</th>
      <th>Bollinger Upper</th>
      <th>Obv</th>
      <th>Adx</th>
      <th>Cmf</th>
      <th>Support</th>
      <th>Resistance</th>
      <th>Pivot Point</th>
      <th>Signal</th>
    </tr>
  </thead>
  <tbody>
  ${data
    .map(
      (x) => `
    <tr style="color: ${
      x[13].includes("Strong Sell")
        ? "red"
        : x[13].includes("Strong Buy")
        ? "#15d115"
        : "black"
    }">
      <td data-label="Time">${x[0]}</td>
      <td data-label="Pair">${x[1]}</td>
      <td data-label="Price">${x[2]}</td>
      <td data-label="RSI" style="color: ${
        x[3] > 72 ? "red" : x[3] < 29 ? "#15d115" : "black"
      }">${x[3]}</td>
      <td data-label="MACD">${x[4]}</td>
      <td data-label="BollingerL">${x[5]}</td>
      <td data-label="BollingerU">${x[6]}</td>
      <td data-label="Obv">${x[7].toLocaleString()}</td>
      <td data-label="Adx">${x[8]}</td>
      <td data-label="Cmf">${x[9]}</td>
      <td data-label="Support">${x[10]}</td>
      <td data-label="Resistance">${x[11]}</td>
      <td data-label="Pivot Point">${x[12]}</td>
      <td data-label="Signal">${x[13]}</td>
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
      <th><a href="${DOMAIN_URL}/all">Pair</a></th>
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
      <td data-label="Time"><a href="${DOMAIN_URL}/products?name=${x[1]}">${
        x[0]
      }</a></td>
      <td data-label="Pair">${x[1]}</td>
      <td data-label="RSI" style="color: ${
        x[2] > 72 ? "red" : x[2] < 29 ? "#15d115" : "black"
      }">${x[2]}</td>
      <td data-label="MACD">${x[3]}</td>
      <td data-label="CMF">${x[4]}</td>
      <td data-label="OBV">${x[5].toLocaleString()}</td>
      <td data-label="Price">${x[6]}</td>
      <td data-label="Trend"><a href="${REQUEST_URL}/products?name=${x[1]}">${
        x[7]
      }</a></td>
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

export {
  home,
  test,
  all,
  name,
  handleName,
  analyzeMarkets,
  getProducts,
  getProductByWeek,
  getProductByName,
};
