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
  const [{  totalOrders }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      inCart: [],
      userList: [],
      totalOrders: [],
    }
  );
  ////////////////////////////////////////////////////////////////////////////


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
       <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      <div className="orders-container">
    <div className='order-filter'>
      <div class='filter-dropdown'>
        <button class='filter-search-btn'>
            Filter Search
            <span class="material-icons filter-expand">expand_more</span>
          </button>

        <div class='filter-btn-container'>
          <button onClick={() => adminSortName(totalOrders)}>SortByName</button>
          <button onClick={() => adminSortDate(totalOrders)}>SortByDate</button>
          <button onClick={() => adminSortExpensive(totalOrders)}>
            SortByExpensive
          </button>
          <button onClick={() => adminSortCheap(totalOrders)}>SortByCheap</button> 
        </div>
      </div>
      </div> 
                
      
        {totalOrders.map((order) => (
          <div key={order._id} sm={6} md={4} lg={3} className="orders">

              <label className="order-num">Order Number: </label> {order._id}
              <div className='order-labels'>
                <label>Title</label>
                <label>Qty</label>
                <label>Price</label>
              </div>

              <div className='order'>
                {order.items.map((item) => (
                  <div key={item._id} sm={6} md={4} lg={3} className="order-info">
                      <label>{item.title}</label>
                      <label>{item.quantity}</label>
                      <label>${item.price}</label>            
                  </div>
                ))}
              </div>
              
              <label className='order-total'>Total: </label>${order.total}
             
       
          </div>
        ))}
        {''}
      </div>
    </div>
  );
};

export default OrderHistory;
