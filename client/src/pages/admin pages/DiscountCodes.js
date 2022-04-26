import React from 'react';
import '../font.css';
import axios from 'axios';
import { useState, useReducer, useEffect } from 'react';

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
    { products, inCart, userList, totalOrders, allDiscounts, loadingUpload },
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
      // console.log(newUser);
      axios.post('/api/discounts/newdiscount', newDiscount);
    }

  return (
    <div>
      <h4>Add/Delete Discount Codes</h4>
      <div>
        {allDiscounts.map((discount) => (
          <div key={discount._id} sm={6} md={4} lg={3} className="mb-3">
            <div>
              Code Name: {discount.name} || Multiplier: {discount.multi}
              <button onClick={() => deleteDiscount(discount)}> Delete</button>
            </div>
          </div>
        ))}
        <h4>Enter new discount Code:</h4>
        <div>
          <input
            onChange={adminCodeEntry}
            name="name"
            value={newCode.name}
            className="form-control"
            placeholder="Discount code name"
          ></input>
        </div>
        <div>
          <input
            onChange={adminCodeEntry}
            name="multi"
            value={newCode.multi}
            placeholder="Multiplier e.g. 50% =0.5"
          ></input>
        </div>
        <div>
          <button onClick={newDiscountCode}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
