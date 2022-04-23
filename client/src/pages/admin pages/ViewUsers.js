import React from "react";
import { useState, useReducer, useEffect } from 'react';
import '../font.css';
import './css/ViewUsers.css'
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

const ViewUsers = () =>{
  //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ userList }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      inCart: [],
      userList: [],
      totalOrders: [],
    }
  );
  ////////////////////////////////////////////////////////////////////////////


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


  /// hook for EDITING USER ACCOUNTS

  const [editAccount, setAccount] = useState({
    _id: '',
    nameEdit: '',
    emailEdit: '',
    isAdminEdit: '',
  });



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
    window.location.reload();
  }
  /////////////////////////////

  //deleteAccount handler
  function deleteAccountHandler(account, event) {
    const id = account._id;
    axios.delete(`/api/users/deleteaccount/${id}`);
    window.location.reload();
  }
  ////////////////////////////
 
    
    return <div> 
        <h7>Select User to Edit</h7>
        <div className="users">
        {userList.map((account) => (
            <button className="user-to-edit" onClick={() => accountToEdit(account)}> 
                <div key={account._id} sm={6} md={4} lg={3} className="mb-3">
                    <div>
                    Name: {account.name} <br/>  
                    Email: {account.email} <br/>
                    Admin Status: {account.isAdmin ? 'true' : 'false'} {'  '}
                    </div>
                </div>
            </button>
        ))}
      </div>
         <div className="edit-user">
         <label>Name</label>
                <input 
                    onChange={userFieldChange}
                    name="nameEdit"
                    value={editAccount.nameEdit}
                    className="form-control"
                ></input>
            <label>Email</label>
                <input 
                    nChange={userFieldChange}
                    name="emailEdit"
                    value={editAccount.emailEdit}
                    className="form-control"
                ></input>
            <label>Admin Status</label>
                <input
                    onChange={userFieldChange}
                    name="isAdminEdit"
                    value={editAccount.isAdminEdit}
                    className="form-control"
                ></input>
            <div className="edit-user-btns">
                <button className='user-change-btn' onClick= {(event) => pushAccountChange(editAccount, event)} >Submit Change</button>
                <button className='user-delete-btn' onClick={(event) => deleteAccountHandler(editAccount, event)}>{' '}Delete</button>
            </div>
            

         </div>
    </div>
   
}

export default ViewUsers;