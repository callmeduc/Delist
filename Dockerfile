# Sử dụng hình ảnh Node.js chính thức
FROM node:20

# Cài đặt các thư viện hệ thống cần thiết cho Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các tệp cấu hình vào container
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Cài đặt trình duyệt của Playwright
RUN npx playwright install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy ứng dụng
CMD ["npm", "start"]
