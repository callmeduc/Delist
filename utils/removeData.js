// removeData.js 
import schedule from "node-schedule";
import Product from "../models/productModel.js";

const deleteOldData = async () => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    const result = await Product.deleteMany({
      createdAt: { $lt: twoMonthsAgo },
    });
    console.log(`${result.deletedCount} bản ghi đã bị xóa.`);
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
  }
};

// Lên lịch chạy hàm xóa dữ liệu mỗi 2 tháng
schedule.scheduleJob("0 0 1 */2 *", () => {
  console.log("Bắt đầu xóa dữ liệu cũ...");
  deleteOldData();
});
