import Book from './bookInfoSchema.js';
import data from './storeInventory.js';
import express from 'express';

const bookToMongoRouter = express.Router();

bookToMongoRouter.get('/', async (req, res) => {
  await Book.remove({});
  const bookInventory = await Book.insertMany(data.inventory);
  res.send({ bookInventory });


});

export default bookToMongoRouter;
