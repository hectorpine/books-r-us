import CartItem from './cartItemSchema.js';
import cartData from './cartSeed.js';
import express from 'express';

const cartToMongoRouter = express.Router();

cartToMongoRouter.get('/', async (req, res) => {
  await CartItem.remove({});
  const cartItems = await CartItem.insertMany(cartData.cartItems);
  res.send({ cartItems });

});

export default cartToMongoRouter;