import { DOMAIN_URL } from "./config.js";
// const formatTime = (date) => {
//     const d = new Date(date);
//     return d.toLocaleString('vi-VN'); // Ví dụ: "13/11/2024, 14:25:11"
//   };
const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export const styleCSS = `
        <style>
        /* Thiết kế mặc định cho màn hình lớn */
        .responsive-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ccc;
            margin-top: 15px;
            font-family: Arial, sans-serif;
        }

        .responsive-table th, .responsive-table td {
            padding: 10px;
            text-align: center;
            border: 1px solid #ccc;
        }

        .responsive-table th {
            background-color: #f2f2f2;
        }

        .responsive-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .responsive-table tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        .responsive-table tbody tr:hover {
            background-color: #e6f7ff;
            cursor: pointer;
        }
            a {
            text-decoration: none;
              }

        /* Thiết kế đặc biệt cho màn hình nhỏ hơn 600px */
        @media (max-width: 600px) {
            .responsive-table, .responsive-table thead, .responsive-table tbody, .responsive-table th, .responsive-table td, .responsive-table tr {
                display: block;
                width: 100%;
            }

            /* Ẩn tiêu đề cột trên màn hình hẹp */
            .responsive-table thead tr {
                display: none;
            }

            /* Thiết kế các ô như từng hàng độc lập */
            .responsive-table td {
                text-align: right;
                padding: 10px 5px;
                position: relative;
            }

            /* Thêm nhãn cho từng ô để người dùng dễ nhận biết */
            .responsive-table td::before {
                content: attr(data-label);
                position: absolute;
                left: 0;
                width: 50%;
                padding-left: 10px;
                font-weight: bold;
                text-align: left;
            }
        }
    </style>
`;
export const tableTemplate = (table, form = "") => `
<html>
<head>
  ${styleCSS}
</head>
<body>
    <h3><a href="${DOMAIN_URL}/week">Get all products</a></h3>
    ${form}

    ${table}
</body>
</html>



`;
export const tableBody = (products) => `

<table class="responsive-table">
  <thead>
    <tr>
      <th><a href="${DOMAIN_URL}/market?time=1h">#</a></th>
      <th>Time</th>
      <th>Pair</th>
      <th>RSI</th>
      <th>MACD</th>
      <th>CMF</th>
      <th>OBV</th>
      <th>Price</th>
      <th>Signal</th>
    </tr>
  </thead>
  <tbody>
  ${products
    .map(
      (item, i) => `
    <tr style="color: ${
      item.rsi > 72 && item.macd < 0 && item.cmf < 0
        ? "red"
        : item.rsi < 29 && item.macd > 0 && item.cmf > 0
        ? "#15d115"
        : "black"
    }">
    <td>${++i}</td>
            <td>${formatTime(item.createdAt)}</td>
            <td>${item.name}</td>
            <td style="color: ${
              item.rsi > 77 ? "red" : item.rsi < 25 ? "#15d115" : "black"
            }">${item.rsi}</td>
            <td>${item.macd}</td>
            <td>${item.cmf}</td>
            <td>${item.obv.toLocaleString()}</td>
            <td>${item.price}</td>
            <td>${item.signal}</td>
    </tr>`
    )
    .join("")}
  </tbody>
</table>

    `;
export const tableWeekBody = (products) => `

<table class="responsive-table">
  <thead>
    <tr>
      <th><a href="${DOMAIN_URL}/market?time=1h">#</a></th>
      <th>Time</th>
      <th>Pair</th>
      <th>RSI</th>
      <th>MACD</th>
      <th>CMF</th>
      <th>OBV</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
  ${products
    .map(
      (item, i) => `
    <tr style="color: ${
      item.rsi > 72 && item.macd < 0 && item.cmf < 0
        ? "red"
        : item.rsi < 29 && item.macd > 0 && item.cmf > 0
        ? "#15d115"
        : "black"
    }">
    <td>${++i}</td>
            <td>${item._id}</td>
            <td>${item.name}</td>
            <td style="color: ${
              item.rsi > 77 ? "red" : item.rsi < 25 ? "#15d115" : "black"
            }">${item.rsi}</td>
            <td>${item.macd}</td>
            <td>${item.cmf}</td>
            <td>${item.obv.toLocaleString()}</td>
            <td>${item.price}</td>
    </tr>`
    )
    .join("")}
  </tbody>
</table>

    `;

export const submitTable = (products, route = "/products") => `
              <form action="${route}" method="GET">
                <label for="name">Chọn một lựa chọn:</label>
                <select name="name" id="name">
                  ${products
                    .map((product) => {
                      return `
                      <option value="${product}" ${
                        product === "BTCUSDT" ? "selected" : ""
                      }>
                        ${product}
                      </option>
                    `;
                    })
                    .join("")}
                </select>
                <button type="submit">Send</button>
              </form>
`;
