import Order from './orderSchema.js';
import orderData from './orderSeed.js';
import express from 'express';

const orderToMongoRouter = express.Router();

orderToMongoRouter.get('/', async (req, res) => {
  await Order.remove({});
  const orders = await Order.insertMany(orderData.orders);
  res.send({ orders });
});

export default orderToMongoRouter;