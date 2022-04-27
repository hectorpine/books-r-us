import React from 'react';
import './css/Cart.css';
import './font.css';
import { useState, useReducer, useEffect } from 'react';
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

const Cart = () => {
  //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ inCart }, dispatch] = useReducer(reducer, {
    products: [],
    inCart: [],
    userList: [],
    totalOrders: [],
  });
  ////////////////////////////////////////////////////////////////////////////

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
    setPrice(() => {
      //console.log('signs', discount, cartTotal);
      //console.log(cartTotal);
      // return 22;
      console.log(discount);
      return discount === 1
        ? cartTotal * 1.0825
        : discount * cartTotal * 1.0825;
    });
  });
  /////////////////////////////////////////////////////////

  ///uses .reduce() function to return
  ///total price of items including tax
  let { cartTotal } = inCart.reduce(
    (total, cartItem) => {
      const { price, quantity } = cartItem;
      total.cartTotal += price * quantity;
      return total;
    },
    {
      cartTotal: 0,
    }
  );

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

  ///addOne() handler increases number of item quantity in cart by one
  const removeOne = (product, quantity) => {
    const newQuant = product.quantity - 1;
    const id = product._id;
    axios.put('/api/cartitems/increase', { quantity: newQuant, _id: id }); //.then(fetchCart());
  };
  //////////////////////////////////////////
  const [customerCode, setCode] = useState({ name: '' });
  const [discount, setDiscount] = useState(1);
  const [orderPrice, setPrice] = useState(cartTotal);

  function handleCodeField(event) {
    const { name, value } = event.target;
    setCode((values) => {
      return {
        ...values,
        [name]: value,
      };
    });
  }

  const applyDiscount = async (event) => {
    ///get a discount code
    const name = customerCode.name;
    console.log(name);
    const { data } = await axios.post('/api/discounts/find', { name });

    ///send axios request
    ///null if its false
    const currentCode = data;
    console.log(currentCode.multi);
    setDiscount(() => {
      return currentCode.multi;
    });
    console.log(discount);
  };

  let { subTotal } = inCart.reduce(
    (total, cartItem) => {
      const { price, quantity } = cartItem;
      total.subTotal += price * quantity;
      return total;
    },
    {
      subTotal: 0,
    }
  );

  let { tax } = inCart.reduce(
    (total, cartItem) => {
      const { price, quantity } = cartItem;
      total.tax += price * quantity * 0.0825;
      return total;
    },
    {
      tax: 0,
    }
  );
  ////////////////////////////////////////////
  var discountCode = false;

  ///Cart total while checking for discount code boolean
  cartTotal = discountCode
    ? parseFloat(cartTotal.toFixed(2)) * 0.8
    : parseFloat(cartTotal.toFixed(2));
  ////////////////////////////////////////////////////////
  const loggedOn = JSON.parse(localStorage.getItem('user'));
  function placeOrderHandler(event) {
    const currentCart = inCart;
    const today = new Date().toLocaleDateString('en-US');
    const custEmail = loggedOn.email;
    const custName = loggedOn.name;
    const total = orderPrice;
    const orderItems = {
      name: custName,
      email: custEmail,
      date: today,
      items: currentCart,
      total: total,
    };

    axios.post('/api/orders/neworder', orderItems);
  }

  return (
    <div>
      <h3>My Cart</h3>
      <div className="cart-bkgrnd"></div>

      <div className="my-cart">
        <div>
          {inCart.map((product) => (
            <div key={product.itemId} className="my-cart-books">
              <div className="my-cart-book-img">
                <img src={product.image} alt="" width="160" height="220"></img>
              </div>

              <div className="my-cart-book-info">
                <div className="my-cart-book-title cart-book-info">
                  {product.title}
                </div>
                <div className="my-cart-book-author cart-book-info">
                  {product.author}
                </div>
                <div className="my-cart-book-price cart-book-info">
                  ${product.price}{' '}
                </div>
                <div className="my-cart-book-qty cart-book-info">
                  <button
                    className="qty-sub qty-btn"
                    onClick={() => removeOne(product, product.quantity - 1)}
                  >
                    -
                  </button>
                  <div className="qty-box">{product.quantity}</div>
                  <button
                    className="qty-add qty-btn"
                    onClick={() => addOne(product, product.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="my-cart-book-remove cart-book-info">
                  <button
                    className="remove-book-btn"
                    onClick={() => removeFromCart(product)}
                  >
                    remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="discount">
        <label>Discount Code:</label>
        <input
          onChange={handleCodeField}
          name="name"
          value={customerCode.name}
          className="form-control"
          placeholder="Enter discount code"
        ></input>{' '}
        <button onClick={applyDiscount} className="applyBtn">
          Apply Discount
        </button>
      </div>

      <div className="price">
        <label>Subtotal: ${subTotal.toFixed(2)}</label>
        <label>
          Discount:{' '}
          {discount == 1 ? (
            <text>$0.00</text>
          ) : (
            <text>${((1 - discount) * cartTotal).toFixed(2)}</text>
          )}
        </label>
        <label>Tax: ${((orderPrice / 1.0825) * 0.0825).toFixed(2)}</label>
        <label>Total: ${orderPrice.toFixed(2)}</label>
        <button
          className="checkoutBtn"
          onClick={(event) => placeOrderHandler(event)}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
