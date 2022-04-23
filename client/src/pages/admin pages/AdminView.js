import React from "react";
import './css/AdminView.css';
import '../font.css';
import { Outlet, Link } from 'react-router-dom';


const AdminView = () =>{
    
    const signOut = () => {
        // javascript code to sign out admin goes here
    }
/*
var links = document.getElementById("sidebarLinks");
var btns = links.getElementsByClassName("adminBtn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("adminAddBtn");
  current[0].className = current[0].className.replace(" adminAddBtn", "");
  this.className += " adminAddBtn";
  });
}
*/
    return <div> 
        <div className="header2"> 
            <div className="admin-header-bkg"></div>
            <h2>Admin View</h2>
            <button className="signoutBtn" onClick={signOut}>Sign Out</button>
            <div className="hl"></div>
        </div>
        
        <div className="AdminSidebar">
            <div className="vl"></div>
            <div id="sidebarLinks" className="admin-sidebar-nav">
                <Link to="/admin">
                    <button class="adminBtn adminAddBtn">Add New Book</button>
                </Link> <br/>
                <div className="l1"></div>
                <Link to="viewinventory">
                    <button class="adminBtn">Inventory</button>
                </Link> <br/>
                <div className="l1"></div>
                <Link to="orderhistory">
                    <button class="adminBtn">Order History</button>
                </Link> <br/>
                <div className="l1"></div>
                <Link to="sales">
                    <button class="adminBtn">Discount Codes</button>
                </Link> <br/>
                <div className="l1"></div>
                <Link to="users">
                    <button class="adminBtn">Users</button>
                </Link>
                <div className="l1"></div>
            </div>
        </div>
        <Outlet />
    </div>
   
}

export default AdminView;