import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookToMongoRouter from './mongoSchemaCreation.js';
import Book from './bookInfoSchema.js';
import cartToMongoRouter from './cartCreationRouter.js';
import CartItem from './cartItemSchema.js';
import User from './userAccountSchema.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from './token.js';
import userRoute from './userRoute.js';

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

//app is an function that calls the express function
const app = express();
///book inventory seed
app.use('/api/seed', bookToMongoRouter);
app.use('/api/cartseed', cartToMongoRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const inventoryRouter = express.Router();
console.log('Should be api/books request');
//app.use('/api/books',inventoryRouter);
const signInRouter = express.Router();
//app.use('/api/users', userRoute);

app.use(
  '/api/users/signin',
  signInRouter.post(
    '/',
    expressAsyncHandler(async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      //json=true;
      const dbUser = await User.findOne({ email: email });
      console.log(dbUser);
      if (dbUser) {
        if (password == dbUser.password) {
          const userAccount = {};
          res.send({
            _id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            isAdmin: dbUser.isAdmin,
            // token: generateToken(dbUser),
          });
          console.log('in server.js');
          return;
        }
      }
      //res.status(401).send({ message: 'Invalid email or password' });
    })
  )
);

////GET REQUESTS
app.use(
  '/api/books',
  inventoryRouter.get('/', async (req, res) => {
    const products = await Book.find();
    res.send(products);
  })
);
const cartRouter = express.Router();
app.use(
  '/api/cartitems',
  cartRouter.get('/', async (req, res) => {
    const itemsInCart = await CartItem.find();
    res.send(itemsInCart);
  })
);

////POST REQUEST

////create account
const userRouter = express.Router();
app.use(
  '/api/users/newaccount',
  userRouter.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = false;

    const newUser = new User({
      name,
      email,
      password,
      isAdmin,
    });
    newUser.save();
  })
);

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

////create book
app.use(
  '/api/books',
  inventoryRouter.post('/', async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const reference = req.body.reference;
    const genre = req.body.genre;
    const image = req.body.image;
    const price = req.body.price;
    const stock = req.body.stock;
    const description = req.body.description;

    const newBook = new Book({
      title,
      author,
      reference,
      genre,
      image,
      price,
      stock,
      description,
    });
    newBook.save();
  })
);

app.use(
  '/api/cartitems/addToCart',
  cartRouter.post('/', async (req, res) => {
    const itemId = req.body.itemId;
    const title = req.body.title;
    const quantity = req.body.quantity;
    const price = req.body.price;

    const newCartItem = new CartItem({
      itemId,
      title,
      quantity,
      price,
    });
    newCartItem.save();
  })
);

//////DELETE request
app.use(
  '/api/cartitems/delete',
  cartRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await CartItem.findByIdAndRemove(id).exec();
    res.send('removed from cart');

    //removable.delete();
  })
);

/////PUT request
app.use(
  '/api/cartitems/increase',
  cartRouter.put('/', async (req, res) => {
    //const updatedQuant = Number(req.body.newQuant);
    const id = req.body._id;
    const edited = await CartItem.findByIdAndUpdate(id, req.body);
    res.send({ quantity: edited.quantity });
  })
);

const updateBookRouter = express.Router();
app.use(
  '/api/books/edititems',
  updateBookRouter.put('/', async (req, res) => {
    const title = req.body.title;
    const id = req.body._id;
    console.log(title, id);
    const changed = await Book.findByIdAndUpdate(id, req.body);
    res.send(changed);
    console.log(changed);
  })
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  ///port where server is ran, and data.js information will be displayed
  console.log(`server at http://localhost:${port}`); ///Here the ${port} is able to be dereferenced because this --> ` is a backtick or tilde, not a quote mark
});
