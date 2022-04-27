import React from 'react';
import '../font.css';
import axios from 'axios';
import { useState, useReducer, useEffect } from 'react';
import './css/DiscountCodes.css';


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
    case 'ALL_DISCOUNTS':
      return { ...state, allDiscounts: action.payload, loading: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const Sales = () => {
  const [
    {  allDiscounts },
    dispatch,
  ] = useReducer(reducer, {
    products: [],
    inCart: [],
    userList: [],
    totalOrders: [],
    allDiscounts: [],
  });

  const [newCode, setAdminDiscount] = useState({ name: '', multi: '' });
  function deleteDiscount(discount, event) {
    const discountId = discount._id;
    axios.delete(`/api/discounts/delete/${discountId}`);
    window.location.reload();
  }
    useEffect(() => {
      const fetchDiscounts = async () => {
        const discountCodesList = await axios.get('/api/discounts/allcodes');
        dispatch({ type: 'ALL_DISCOUNTS', payload: discountCodesList.data });
      };
      fetchDiscounts();
    }, []);

    function adminCodeEntry(event) {
      const { name, value } = event.target;
      setAdminDiscount((prevInput) => {
        return {
          ...prevInput,
          [name]: value,
        };
      });
    }
    function newDiscountCode(event) {
      event.preventDefault();
      const newDiscount = {
        name: newCode.name,
        multi: newCode.multi,
      };
      window.location.reload();
      // console.log(newUser);
      axios.post('/api/discounts/newdiscount', newDiscount);
    }

  return (
    <div>
      <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      <h7>Add/Delete Discount Codes</h7>
      <div>
        <div className='discounts-available'>
          <h9>Discounts Available</h9>
          {allDiscounts.map((discount) => (
            <div key={discount._id} sm={6} md={4} lg={3} className="mb-3">
              <div className='discount-code'>
                <lable>Code Name: {discount.name}</lable>
                <label>Multiplier: {discount.multi}</label>
                  
                <button onClick={() => deleteDiscount(discount)}> 
                  <span class="material-icons">clear</span>
                </button>
              </div>

          </div>
        ))}
        </div>
        <div className='dicount-input'>
         <h9>Enter new discount Code:</h9>
            <label>Discount Code</label>
            <input
              onChange={adminCodeEntry}
              name="name"
              value={newCode.name}
              className="form-control"
              placeholder="e.g. 50OFF"
            ></input>
         
            <label>Multiplier</label>
            <input
              onChange={adminCodeEntry}
              name="multi"
              value={newCode.multi}
              placeholder="e.g. 50% = 0.5"
            ></input>
            <button className='submit-code' onClick={newDiscountCode}>Submit</button>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Sales;
