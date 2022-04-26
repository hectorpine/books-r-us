import Discount from './discountSchema.js';
import discountData from './discountSeed.js';
import express from 'express';

const discountMongoRouter = express.Router();

discountMongoRouter.get('/', async (req, res) => {
  await Discount.remove({});
  const discountCodes = await Discount.insertMany(discountData.discountcodes);
  res.send({ discountCodes });
});

export default discountMongoRouter;
