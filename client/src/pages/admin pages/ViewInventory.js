import React from "react";
import { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import '../font.css';
import './css/ViewInventory.css'

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

const ViewInventory = () =>{
  //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ products}, dispatch] = useReducer(
    reducer,
    {
      products: [],
 
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


    return <div> 
        <h7>Select Book to Edit</h7>
        <div class='books-to-edit'>
            {products.map((product) => (
            <button className='books-to-edit-btn' onClick={() => itemToEdit(product)}>     
                <div key={product._id} sm={6} md={4} lg={3}>
                    <div>
                        {product.title} by {product.author} 
                    </div>
                </div> 
            </button>
            ))}
        </div>

        <div className="edit-book">
            <div className="edit-book-info">
                <label>Title</label>
                <input 
                
                    onChange={editFieldChange}
                    name="titleEdit"
                    value={editedBook.titleEdit}
                    className="form-control"
                ></input>

                <label>Author</label>
                <input
                    onChange={editFieldChange}
                    name="authorEdit"
                    value={editedBook.authorEdit}
                    className="form-control"
                ></input>

                <label>Genre</label>
                <input
                    onChange={editFieldChange}
                    name="genreEdit"
                    value={editedBook.genreEdit}
                    className="form-control"
                ></input>

                <label>Description</label>
                <textarea
                    rows="5"
                    onChange={editFieldChange}
                    name="descriptionEdit"
                    value={editedBook.descriptionEdit}
                    className="form-control"
                ></textarea>

                <label>Price ($)</label>
                <input
                    onChange={editFieldChange}
                    name="priceEdit"
                    value={editedBook.priceEdit}
                    className="form-control"
                ></input>

                <label>Qty.</label>
                <input
                    onChange={editFieldChange}
                    name="stockEdit"
                    value={editedBook.stockEdit}
                    className="form-control"
                ></input>

                <button className="edit-book-btn"  onClick={(event) => pushItemChange(editedBook, event)}>Submit Changes</button>
            </div>
        </div>
    </div>
   
}

export default ViewInventory;