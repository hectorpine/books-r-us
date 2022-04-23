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
      // console.log('reducer()');
      return { ...state, inCart: action.payload, loading: false };
    case 'PULL_USERS':
      return { ...state, userList: action.payload, loading: false };
    case 'PULL_ORDERS':
      return { ...state, totalOrders: action.payload, loading: false };
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
  const [{ products, inCart, userList, totalOrders }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      inCart: [],
      userList: [],
      totalOrders: [],
    }
  );
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
      // console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };

    fetchData();
    //  console.log('fetchCart()');
    fetchCart();
  }, []);
  //////////////////////////////////////////////////////////

  //useEffect() hook used to refresh cart upon additional
  //addition to cart
  useEffect(() => {
    const fetchCart = async () => {
      const mongoCart = await axios.get('/api/cartitems');
      // console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };
    fetchCart();
  }); //////ADD BRACKETS FOR CART FUNCTION
  /////////////////////////////////////////////////////////

  //ADMIN USER ACCOUNT CHANGES useEffect() hook needed to load all users
  useEffect(() => {
    const fetchUsers = async () => {
      const list = await axios.get('/api/users/pull');
      // console.log(mongoCart.data);
      dispatch({ type: 'PULL_USERS', payload: list.data });
    };
    fetchUsers();
  }, []);

  //////////////////////////////////////////////////////////////////

  //Admin TOTAL ORDERS useEffect() hook needed to pull all orders from database

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await axios.get('/api/orders/requestall');
      dispatch({ type: 'PULL_ORDERS', payload: allOrders.data });
    };
    fetchOrders();
    // console.log(totalOrders.items);
  }, []);

  /////////////////////////////////////////////////////////////////////////////

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

  ///hook used to get information from user input fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  ///////////////////////////////////////////////////

  ///hook for SIGN IN form functionality
  const [signfield, setSignIn] = useState({
    email: '',
    password: '',
  });
  ///////////////////////////////////////////////////

  ////hook for EDIT ITEMS
  const [editedBook, setEdit] = useState({
    _id: '',
    titleEdit: '',
    authorEdit: '',
    genreEdit: '',
    priceEdit: '',
    stockEdit: '',
    descriptionEdit: '',
  });
  ///////////////////////////////////////////

  /// hook for EDITING USER ACCOUNTS

  const [editAccount, setAccount] = useState({
    _id: '',
    nameEdit: '',
    emailEdit: '',
    isAdminEdit: '',
  });

  /////////////////////////////////
  const [onlineUser, setUser] = useState({
    email: '',
    isAdmin: '',
    name: '',
    _id: '',
  });

  ///SignedIn User

  ////////////////////////////////////

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

  ///NEW USER CREATION HANDLER
  function createUser(event) {
    event.preventDefault();
    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    console.log(newUser);
    axios.post('/api/users/newaccount', newUser);
  }
  //////////////////////////

  /// user registration form field changes
  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value,
      };
    });
  }
  ////////////////////////////

  /////USER SIGN IN FIELDS
  function handleSignInFields(event) {
    const { name, value } = event.target;
    setSignIn((values) => {
      return {
        ...values,
        [name]: value,
      };
    });
  }
  ////////////////////////////

  

  ///SIGN IN
  const signInHandler = async (event) => {
    event.preventDefault();

    const email = signfield.email;
    const password = signfield.password;
    //const {loggedUser} = {_id:'' ,email:'',name:'',isAdmin:''}

    const user = {
      email: signfield.email,
      password: signfield.password,
    };

    const { data } = await axios.post('/api/users/signin', {
      email,
      password,
    });

    console.log('printed data', data);
    const loggedUser = data;
    console.log(loggedUser);
    //console.log(JSON.stringify(loggedUser));
  };
  //////////////////////////

  /////ITEM EDITING MENU OPTIONS
  function itemToEdit(product) {
    // const { name, value } = product.target;
    setEdit(() => {
      return {
        _id: product._id,
        titleEdit: product.title,
        authorEdit: product.author,
        genreEdit: product.genre,
        priceEdit: product.price,
        stockEdit: product.stock,
        descriptionEdit: product.description,
      };
    });
  }

  /////////////////////////////

  /////Submit change for item
  function pushItemChange(product, event) {
    event.preventDefault();

    const id = editedBook._id;
    const newTitle = editedBook.titleEdit;
    const newAuthor = editedBook.authorEdit;
    const newGenre = editedBook.genreEdit;
    const newPrice = editedBook.priceEdit;
    const newStock = editedBook.stockEdit;
    const newDesc = editedBook.descriptionEdit;

    axios.put('/api/books/edititems', {
      _id: id,
      title: newTitle,
      author: newAuthor,
      genre: newGenre,
      price: newPrice,
      stock: newStock,
      description: newDesc,
    });

    // console.log(editedBook);
  }
  /////////////////////////////

  ////EDIT FIELD CHANGE
  function editFieldChange(event) {
    const { name, value } = event.target;
    setEdit((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  /////

  ///EDIT USER ACCOUNT FIELD CHANGE
  function userFieldChange(event) {
    const { name, value } = event.target;
    setAccount((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  /////////////////////////////////
  //USER ACCOUNT EDIT filed population
  function accountToEdit(account) {
    setAccount(() => {
      return {
        _id: account._id,
        nameEdit: account.name,
        emailEdit: account.email,
        isAdminEdit: account.isAdmin,
      };
    });
  }

  /////////////////////////////////////////////////

  /////Submit change for item
  function pushAccountChange(product, event) {
    event.preventDefault();

    const id = editAccount._id;
    const newName = editAccount.nameEdit;
    const newEmail = editAccount.emailEdit;
    const adminStatus = editAccount.isAdminEdit;
    console.log(adminStatus);

    axios.put('/api/users/editaccounts', {
      _id: id,
      name: newName,
      email: newEmail,
      isAdmin: adminStatus,
    });

    // console.log(editedBook);
  }
  /////////////////////////////

  //deleteAccount handler
  function deleteAccountHandler(account, event) {
    const id = account._id;
    axios.delete(`/api/users/deleteaccount/${id}`);
  }
  ////////////////////////////
  function placeOrderHandler(event) {
    const currentCart = inCart;
    const orderItems = { items: currentCart };

    axios.post('/api/orders/neworder', orderItems);
  }

  //////

  ///print info
  function printInfo() {
    console.log(inCart);
    console.log(totalOrders);
  }
  //////////////////////
  return (
    <div>
      {/**Header Buttons, no functionality */}
      <a href="/profile">Signin/User</a>
      {/**Header Buttons, no functionality */}
      {/**SIGN IN*/}
      <h3>Sign In</h3>
      <div>
        <input
          onChange={handleSignInFields}
          name="email"
          value={signfield.email}
          className="form-control"
          placeholder="Enter username"
        ></input>
      </div>
      <div>
        <input
          onChange={handleSignInFields}
          name="password"
          value={signfield.password}
          className="form-control"
          placeholder="Password"
        ></input>
      </div>
      <button onClick={signInHandler}> SignIn</button>
      {/**SIGN IN*/}
      {/**REGISTER */}
      <div>
        <h3>Regist New User</h3>
        <input
          onChange={handleFormChange}
          name="name"
          value={form.name}
          className="form-control"
          placeholder="Enter username"
        ></input>
      </div>
      <div>
        <input
          onChange={handleFormChange}
          name="email"
          value={form.email}
          className="form-control"
          placeholder="Enter email"
        ></input>
      </div>
      <div>
        <input
          onChange={handleFormChange}
          name="password"
          value={form.password}
          className="form-control"
          placeholder="enter password"
        ></input>
      </div>
      <button onClick={createUser}> Register Account</button>
      {/**REGISTER */}
      {/**Display Orders */}
      <h3>Orders</h3>
      <button onClick={() => printInfo()}>PRINT</button>
      <div>
        {''}
        {totalOrders.map((order) => (
          <div key={order._id} sm={6} md={4} lg={3} className="mb-3">
            <div>
              Order: {order._id}
              <div>
                {order.items.map((item) => (
                  <div key={item._id} sm={6} md={4} lg={3} className="mb-3">
                    Item: {item.title} Qty: {item.quantity} Price: ${item.price}
                  </div>
                ))}
              </div>
              -----------------------------------------------
            </div>
          </div>
        ))}
        {''}
      </div>
      {/**Display Orders */}
      {/**CART DISPLAY */}
      <h3>Cart</h3>
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
      <button onClick={(event) => placeOrderHandler(event)}>Place Order</button>
      {/**CART DISPLAY */}
      {/*Edit User */}
      <h3>Admin User Account Changes</h3>
      <div>
        {userList.map((account) => (
          <div key={account._id} sm={6} md={4} lg={3} className="mb-3">
            <div>
              Name: {account.name} || Email: {account.email} || Admin Status:
              {account.isAdmin ? 'true' : 'false'}
              {'  '}
              <button onClick={() => accountToEdit(account)}> Edit User</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <input
          onChange={userFieldChange}
          name="nameEdit"
          value={editAccount.nameEdit}
          className="form-control"
          placeholder="Name"
        ></input>
      </div>
      <div>
        <input
          onChange={userFieldChange}
          name="emailEdit"
          value={editAccount.emailEdit}
          className="form-control"
          placeholder="Email"
        ></input>
      </div>
      <div>
        <input
          onChange={userFieldChange}
          name="isAdminEdit"
          value={editAccount.isAdminEdit}
          className="form-control"
          placeholder="Admin Status"
        ></input>
      </div>
      <button onClick={(event) => pushAccountChange(editAccount, event)}>
        Submit Change
      </button>
      <button onClick={(event) => deleteAccountHandler(editAccount, event)}>
        {' '}
        Delete
      </button>
      {/*Edit User */}
      {/**Edit items */}
      <h3>EDIT ITEMS</h3>
      <div>
        {products.map((product) => (
          <div key={product._id} sm={6} md={4} lg={3} className="mb-3">
            <div>
              {product.title} by {product.author} - ${product.price}- Stock:{' '}
              {product.stock} - Genre: {product.genre} -
              <button onClick={() => itemToEdit(product)}> Edit Item</button>
            </div>
          </div>
        ))}
      </div>
      <h4>Item to Edit</h4>
      <div>
        <input
          onChange={editFieldChange}
          name="titleEdit"
          value={editedBook.titleEdit}
          className="form-control"
          placeholder="Book title"
        ></input>
      </div>
      <div>
        <input
          onChange={editFieldChange}
          name="authorEdit"
          value={editedBook.authorEdit}
          className="form-control"
          placeholder="Book author"
        ></input>
      </div>
      <div>
        <input
          onChange={editFieldChange}
          name="genreEdit"
          value={editedBook.genreEdit}
          className="form-control"
          placeholder="Book genre"
        ></input>
      </div>
      <div>
        <input
          onChange={editFieldChange}
          name="priceEdit"
          value={editedBook.priceEdit}
          className="form-control"
          placeholder="Book price"
        ></input>
      </div>
      <div>
        <input
          onChange={editFieldChange}
          name="stockEdit"
          value={editedBook.stockEdit}
          className="form-control"
          placeholder="Book Stock"
        ></input>
      </div>
      <div>
        <input
          onChange={editFieldChange}
          name="descriptionEdit"
          value={editedBook.descriptionEdit}
          className="form-control"
          placeholder="Book description"
        ></input>
      </div>
      <button onClick={(event) => pushItemChange(editedBook, event)}>
        {' '}
        Submit Change
      </button>

      {/**Edit items */}

      {/*SERACH BAR  */}
      <h3>SEARCH BAR</h3>
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