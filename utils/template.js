import { DOMAIN_URL } from "./config.js";
// const formatTime = (date) => {
//     const d = new Date(date);
//     return d.toLocaleString('vi-VN'); // Ví dụ: "13/11/2024, 14:25:11"
//   };


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
