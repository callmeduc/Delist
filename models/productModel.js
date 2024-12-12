import mongoose from "mongoose";

const marketSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rsi: {
      type: Number,
      required: true,
    },
    macd: {
      type: Number,
      required: true,
    },
    cmf: {
      type: Number,
      required: true,
    },
    obv: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    signal: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục trên trường `name` để tối ưu tìm kiếm
marketSchema.index({ name: 1 });

const Product = mongoose.model("Market", marketSchema);

export default Product;
