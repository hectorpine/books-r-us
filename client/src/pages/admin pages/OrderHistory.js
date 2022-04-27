import React from 'react';
import { useState, useReducer, useEffect } from 'react';
import '../font.css';
import './css/OrderHistory.css';
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

const OrderHistory = () => {
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

  ///admin ORDERS
  const adminSortName = (totalOrders) => {
    function highToLowPrice(a, b) {
     // console.log(a.total, b.total);
      return a.name.localeCompare(b.name);
    }
    console.log(totalOrders);
    totalOrders.sort(highToLowPrice);
    console.log(totalOrders);
  };

  const adminSortDate = (totalOrders) => {
    function dateOrder(a, b) {
      return new Date(a.date) - new Date(b.date);
    }
    totalOrders.sort(dateOrder);
  };

  const adminSortExpensive = (totalOrders) => {
    function highToLowPrice(a, b) {
      return b.total - a.total;
    }
    totalOrders.sort(highToLowPrice);
  };

  const adminSortCheap = (totalOrders) => {
    function lowToHighPrice(a, b) {
      return a.total - b.total;
    }
    totalOrders.sort(lowToHighPrice);
  };
  ////////////////////////////////////

  return (
    <div>
      <div className="orders-container">
        <button onClick={() => adminSortName(totalOrders)}>SortByName</button>
        <button onClick={() => adminSortDate(totalOrders)}>SortByDate</button>
        <button onClick={() => adminSortExpensive(totalOrders)}>
          SortByExpensive
        </button>
        <button onClick={() => adminSortCheap(totalOrders)}>SortByCheap</button>
        {''}
        {totalOrders.map((order) => (
          <div key={order._id} sm={6} md={4} lg={3} className="order">
            <div>
              <label className="order-num">Order: </label> {order._id}
              <div className="order-labels">
                <div>
                  <label>Total: $$${order.total}</label>
                </div>
                <label>Title</label>
                <label>Qty</label>
                <label>Price</label>
              </div>
              <div>
                {order.items.map((item) => (
                  <div key={item._id} sm={6} md={4} lg={3} className="mb-3">
                    <div className="order-info">
                      <label>{item.title}</label>
                      <label>{item.quantity}</label>
                      <label>${item.price}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {''}
      </div>
    </div>
  );
};

export default OrderHistory;
