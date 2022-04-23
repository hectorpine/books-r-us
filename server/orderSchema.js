import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    items: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
