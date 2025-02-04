import mongoose from "mongoose";

const nameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục trên trường `name` để tối ưu tìm kiếm
nameSchema.index({ name: 1 });

const Name = mongoose.model("Name", nameSchema);

export default Name;
