import React from "react";
import './css/MyAccountNav.css';
import './font.css';
import { Outlet, Link } from 'react-router-dom';


const MyAccountNav = () =>{
    return <div> 
        <div className="accNav">

            <div className="vl2"></div>

            <div id="accLinks">
                <Link to="/MyAccount">
                    <button class="myAccBtn accInfoBtn">My Account</button>
                </Link> <br/>
                <div className="l2"></div>
                <Link to="MyOrders">
                    <button class="myAccBtn">My Orders</button>
                </Link> <br/>
                <div className="l2"></div>
            </div>
            
        </div>
        <Outlet />
    </div>
}

export default MyAccountNav;