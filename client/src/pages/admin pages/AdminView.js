import React from "react";
import './css/AdminView.css';
import '../font.css';
import { Outlet, Link } from 'react-router-dom';


const AdminView = () =>{
    

    return <div> 
        <div className="header2"> 
            <div className="admin-header-bkg"></div>
            <h2>Admin View</h2>
            <Link to='/'>
                <button className="signoutBtn">Home Page</button>
            </Link>
            
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
                <Link to="discounts">
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