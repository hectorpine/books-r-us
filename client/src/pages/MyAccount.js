import React from "react";
import './css/MyAccount.css';
import './font.css';


const MyAccount = () =>{
    return <div> 
        
        <div className="accountInfo">
            <label>First Name:</label>
            <input type="text" />
            <label>Last Name:</label>
            <input type="text" />
            <label>Phone Number:</label>
            <input type="number" />
            <label>Email:</label>
            <input type="text" />
            <label>Password:</label>
            <input type="password" />
            <label>Confirm Password:</label>
            <input type="password" />
            <button className="saveBtn">Save Changes</button>
        </div>


    </div>
   
}

export default MyAccount;