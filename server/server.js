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
import orderToMongoRouter from './ordersCreationRouter.js';
import Order from './orderSchema.js';
import discountMongoRouter from './discountMongoRouter.js';
import Discount from './discountSchema.js';
//import uploadRouter from './uploadRoutes.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

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
app.use('/api/orderseed', orderToMongoRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const inventoryRouter = express.Router();
console.log('Should be api/books request');
//app.use('/api/books',inventoryRouter);
const signInRouter = express.Router();
//app.use('/api/users', userRoute);

const upload = multer();
const uploadRouter = express.Router();
app.use(
  '/api/upload',
  uploadRouter.post('/', upload.single('file'), async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  })
);

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
const discountsRetrieveRouter = express.Router();

app.use(
  '/api/discounts/allcodes',
  discountsRetrieveRouter.get('/', async (req, res) => {
    const discountCodes = await Discount.find();
    res.send(discountCodes);
  })
);

const discountCheckRouter = express.Router();
app.use(
  '/api/discounts/find',
  discountCheckRouter.post(
    '/',
    expressAsyncHandler(async (req, res) => {
      const name = req.body.name;

      const discountCode = await Discount.findOne({ name: name });
      //console.log(discountCode.name);
      if (discountCode) {
        res.send({
          //  _id: discountCode._id,
          name: discountCode.name,
          multi: discountCode.multi,
        });
      } else {
        res.send(null);
      }
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

const userPullRouter = express.Router();
app.use(
  '/api/users/pull',
  userPullRouter.get('/', async (req, res) => {
    const totalUsers = await User.find();
    res.send(totalUsers);
  })
);

const allOrdersRouter = express.Router();

app.use(
  '/api/orders/requestall',
  allOrdersRouter.get('/', async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
    //console.log(orders);
  })
);

////POST REQUEST
///create order

const newOrderRouter = express.Router();
app.use(
  '/api/orders/neworder',
  newOrderRouter.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const items = req.body.items;
    const total = req.body.total;

    const recentOrder = new Order({ name, email, date, total, items });
    recentOrder.save();
  })
);

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

///NEW DISCOUNT CODE

const newDiscountRouter = express.Router();
app.use(
  '/api/discounts/newdiscount',
  newDiscountRouter.post('/', async (req, res) => {
    const name = req.body.name;
    const multi = req.body.multi;

    const newCode = new Discount({
      name,
      multi,
    });
    newCode.save();
  })
);

const newBookRouter = express.Router();
////create book
app.use(
  '/api/books/newbook',
  newBookRouter.post('/', async (req, res) => {
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
    const author = req.body.author;
    const image = req.body.image;
    const quantity = req.body.quantity;
    const price = req.body.price;

    const newCartItem = new CartItem({
      itemId,
      title,
      author,
      image,
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
const removeDiscount = express.Router();
app.use(
  '/api/discounts/delete',
  removeDiscount.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await Discount.findByIdAndRemove(id).exec();
    res.send('removed from cart');

    //removable.delete();
  })
);

const removeUserRouter = express.Router();
app.use(
  '/api/users/deleteaccount',
  removeUserRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndRemove(id).exec();
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

///update Account
const updateAccountRouter = express.Router();
app.use(
  '/api/users/editaccounts',
  updateAccountRouter.put('/', async (req, res) => {
    const id = req.body._id;
    const update = await User.findByIdAndUpdate(id, req.body);
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
