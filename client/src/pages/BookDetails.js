import './font.css';
import './css/BookDetails.css'
import { useReducer, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {useParams, Outlet} from "react-router-dom"

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
  
function BookDetails() {

      //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ products }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      inCart: [],
      userList: [],
      totalOrders: [],
    }
  );
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

 
    const {productId} = useParams()
    const thisProduct = products.find(product => product._id === productId)
    
    return(
    <div>
      
      <img className='book-details-img'
        src={thisProduct.image}
        alt=""
      >
      </img>
      <div className='book-details'>
        <div className='book-details-title'>{thisProduct.title}</div>
        <div className='book-details-author'>by {thisProduct.author}</div>
        <div className='book-details-genre'>Genre: {thisProduct.genre}</div>
        <div className='book-details-description'>{thisProduct.description}</div>
        <div className='book-details-price'>${thisProduct.price}</div>
        <div className='book-details-qty'>Qty.{thisProduct.stock}</div>
        <button className='add-to-cart-btn' onClick={() => addToCart(thisProduct)}>Add to Cart</button>
      </div>
      
      <Outlet />
    </div>
    );
}  

export default BookDetails;