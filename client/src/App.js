import { useState, useReducer, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

////This is needed to load all of the books and to load all of the cart items
///For more info please see " React hooks, useReducer()"
const reducer = (state, action) => {
  switch (action.type) {
    case 'PULL_INVENTORY':
      return { ...state, products: action.payload, loading: false };
    case 'RETRIEVE_CART':
      console.log('reducer()');
      return { ...state, inCart: action.payload, loading: false };
    default:
      return state;
  }
};
////////////////////////////////////////////////////////////////////////////

function App() {
  //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ products, inCart }, dispatch] = useReducer(reducer, {
    products: [],
    inCart: [],
  });
  ////////////////////////////////////////////////////////////////////////////

  /////useState  hook used to compare and filter through matching strings
  ////within the book title or author name
  const [searchKey, setSearchKey] = useState('');
  /////////////////////////////////////////////////////////////////////

  /////useEffect() hook sends get request to load "products" array,
  /////as well as inCart array via their reducer functions
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/books');
      dispatch({ type: 'PULL_INVENTORY', payload: result.data });
    };
    const fetchCart = async () => {
      const mongoCart = await axios.get('/api/cartitems');
      console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };

    fetchData();
    console.log('fetchCart()');
    fetchCart();
  }, []);
  //////////////////////////////////////////////////////////

  //useEffect() hook used to refresh cart upon additional
  //addition to cart
  useEffect(() => {
    const fetchCart = async () => {
      const mongoCart = await axios.get('/api/cartitems');
      console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };
    fetchCart();
  });
  /////////////////////////////////////////////////////////

  ////useState() hook used to create and "input" object that
  ///includes all of the needed fields to create new book item
  const [input, setInput] = useState({
    title: '',
    author: '',
    reference: '',
    genre: '',
    image: '',
    price: '',
    stock: '',
    description: '',
  });
  ///////////////////////////////////////////////////////////

  ////handleChange() is the handler used to manage changing
  ///text input within each field of the "New Sale Item" form
  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }
  ////////////////////////////////////////////////////

  ///onClick handler for "New Sale Item" form
  ///Creates a "newBook" object, and sends post
  ///request to database
  function createItemClick(event) {
    event.preventDefault();
    const newBook = {
      title: input.title,
      author: input.author,
      reference: input.reference,
      genre: input.genre,
      image: input.image,
      price: input.price,
      stock: input.stock,
      description: input.description,
    };
    axios.post('/api/books', newBook);
  }
  ///////////////////////////////////////////////

  //addToCart() handler takes in a "product" object
  ////from the "products" array, and takes necessary
  ///fields to create a "newCartItem" object which is then
  ///posted inside "cartitems" database
  function addToCart(product) {
    const newCartItem = {
      itemId: product._id,
      title: product.title,
      quantity: 1,
      price: product.price,
    };
    console.log('BEFORE posting to cart');
    axios.post('/api/cartitems/addToCart', newCartItem);
    console.log('AFTER posting to cart');
  }
  ////////////////////////////////////////////

  ///removeFromCart() handler performs action of removing
  ///item from shopping cart items list from cartitems database
  const removeFromCart = async (product) => {
    console.log('remove From cart clicked');
    const id = product._id;
    await axios.delete(`/api/cartitems/delete/${id}`);
  };
  ///////////////////////////////////////////

  ///addOne() handler increases number of item quantity in cart by one
  const addOne = (product, quantity) => {
    const newQuant = product.quantity + 1;
    const id = product._id;
    axios.put('/api/cartitems/increase', { quantity: newQuant, _id: id }); //.then(fetchCart());
  };
  //////////////////////////////////////////

  ///SORTING BUTTON FUNCTIONS
  const sortExpensiveItems = (products) => {
    function highToLowPrice(a, b) {
      return b.price - a.price;
    }
    products.sort(highToLowPrice);
  };

  const sortCheapItems = (products) => {
    function lowToHighPrice(a, b) {
      return a.price - b.price;
    }
    products.sort(lowToHighPrice);
  };

  const sortMostItems = (products) => {
    function highestStock(a, b) {
      return b.stock - a.stock;
    }
    products.sort(highestStock);
  };

  const sortLeastItems = (products) => {
    function lowestStock(a, b) {
      return a.stock - b.stock;
    }
    products.sort(lowestStock);
  };
  ////////////////////////////////////

  ///uses .reduce() function to return
  ///total price of items including tax
  let { cartTotal } = inCart.reduce(
    (total, cartItem) => {
      const { price, quantity } = cartItem;
      total.cartTotal += price * quantity * 1.0825;
      return total;
    },
    {
      cartTotal: 0,
    }
  );
  ////////////////////////////////////////////
  var discountCode = false;

  ///Cart total while checking for discount code boolean
  cartTotal = discountCode
    ? parseFloat(cartTotal.toFixed(2)) * 0.8
    : parseFloat(cartTotal.toFixed(2));
  ////////////////////////////////////////////////////////
  return (
    <div>
      {/**Header Buttons, no functionality */}
      <a href="/">HomeLink</a>
      <a href="/cart">Cart</a>
      <a href="/profile">Signin/User</a>
      {/**Header Buttons, no functionality */}
      {/*SERACH BAR  */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Find your next adventure..."
          onChange={(event) => {
            setSearchKey(event.target.value);
          }}
        />
      </div>
      {/*SERACH BAR  */}
      {/**CART DISPLAY */}
      <div>
        {inCart.map((product) => (
          <div key={product.itemId} className="mb-3">
            <div>
              {product.title}
              <button>-</button>Qty: {product.quantity}
              <button onClick={() => addOne(product, product.quantity + 1)}>
                +
              </button>
              ${product.price}{' '}
              <button onClick={() => removeFromCart(product)}> remove</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <text>Order Total : ${cartTotal}</text>
      </div>
      {/**CART DISPLAY */}
      {/**NEW SALE ITEM FORM */}
      <div>
        <div>
          <h4>New Sale Item</h4>
          <form>
            <div className="form-group">
              <input
                onChange={handleChange}
                name="title"
                value={input.title}
                className="form-control"
                placeholder="title"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="author"
                value={input.author}
                className="form-control"
                placeholder="author"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="reference"
                value={input.reference}
                className="form-control"
                placeholder="reference"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="genre"
                value={input.genre}
                className="form-control"
                placeholder="genre"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="image"
                value={input.image}
                className="form-control"
                placeholder="image"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="price"
                value={input.price}
                className="form-control"
                placeholder="price"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="stock"
                value={input.stock}
                className="form-control"
                placeholder="stock"
              ></input>
            </div>
            <div>
              <input
                onChange={handleChange}
                name="description"
                value={input.description}
                className="form-control"
                placeholder="description"
              ></input>
            </div>
            <button onClick={createItemClick}> CreateItem</button>
          </form>
        </div>
      </div>
      {/**NEW SALE ITEM FORM */}
      {/**INVENTORY PRODUCT DISPLAY */}
      <div>
        {/**SORTING BUTTONS */}
        <button onClick={() => sortExpensiveItems(products)}>
          {' '}
          Sort by $$$
        </button>
        <button onClick={() => sortCheapItems(products)}> Sort by $</button>
        <button onClick={() => sortMostItems(products)}> Highest Stock</button>
        <button onClick={() => sortLeastItems(products)}> Short Supply</button>
        {/**SORTING BUTTONS */}
        {/*SERACH BAR RESULTS : If the user has typed in the search bar, it will filter for these first before displaying anything*/}
        {products
          .filter((product) => {
            if (searchKey === '') {
              return product;
            } else if (
              product.title.toLowerCase().includes(searchKey.toLowerCase()) ||
              product.author.toLowerCase().includes(searchKey.toLowerCase())
            ) {
              return product;
            }
          })
          /**SERACH BAR FILTER END */
          /**Product display. A "product" is a single element from the "products" array. Below is the html for displaying a single "product" */
          .map((product) => (
            <div key={product._id} sm={6} md={4} lg={3} className="mb-3">
              <img
                src={product.image}
                alt={product.author}
                width="200"
                height="200"
              ></img>
              <div>
                {product.title} by {product.author}
              </div>
              <div> ${product.price}</div>
              <button onClick={() => addToCart(product)}> Add To Cart</button>
            </div>
          ))}
      </div>
      {/**INVENTORY PRODUCT DISPLAY */}
    </div>
  );
}

export default App;
