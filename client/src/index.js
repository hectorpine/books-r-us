import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App';
import Header from "./header/Header"
import Home from "./pages/Home";
import MyAccountNav from "./pages/MyAccountNav";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
//import AdminLogin from "./pages/admin pages/AdminLogin";
import AdminView from "./pages/admin pages/AdminView";
import AddNewBook from "./pages/admin pages/AddNewBook";
import ViewInventory from "./pages/admin pages/ViewInventory";
import OrderHistory from "./pages/admin pages/OrderHistory";
import Sales from "./pages/admin pages/DiscountCodes";
import ViewUsers from "./pages/admin pages/ViewUsers";
import Cart from "./pages/Cart";

export default function Pages() {
  return(
    <Router>
      <Routes>
        <Route path="/app" element={<App />} ></Route>

        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart/>} />
          <Route path="/myaccount" element={<MyAccountNav />}>
            <Route index element={<MyAccount />} />
            <Route path="myorders" element={<MyOrders />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminView />} >
          <Route index element={<AddNewBook />} />
          <Route path="viewinventory" element={<ViewInventory />} />
          <Route path="orderhistory" element={<OrderHistory />} />
          <Route path="sales" element={<Sales />} />
          <Route path="users" element={<ViewUsers />} />
        </Route>

      </Routes>
    </Router>
  );
}




ReactDOM.render(<Pages />, document.getElementById('root'));