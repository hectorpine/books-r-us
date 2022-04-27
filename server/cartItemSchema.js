import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: {type: String, required: true},
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
