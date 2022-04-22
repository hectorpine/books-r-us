import React from "react";
import './Header.css';
import '../pages/font.css'
import { useState } from "react";
import Axios from 'axios';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

const Header = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");


    
  ///hook for SIGN IN form functionality
  const [signfield, setSignIn] = useState({
    email: '',
    password: '',
  });
  ///////////////////////////////////////////////////


  ///SIGN IN
  const signInHandler = async (event) => {
    event.preventDefault();

    const email = signfield.email;
    const password = signfield.password;
    //const {loggedUser} = {_id:'' ,email:'',name:'',isAdmin:''}

    const user = {
      email: signfield.email,
      password: signfield.password,
    };

    const { data } = await axios.post('/api/users/signin', {
      email,
      password,
    });

    console.log('printed data', data);
    const loggedUser = data;
    console.log(loggedUser);
    //console.log(JSON.stringify(loggedUser));
  };
  //////////////////////////


  /////USER SIGN IN FIELDS
  function handleSignInFields(event) {
    const { name, value } = event.target;
    setSignIn((values) => {
      return {
        ...values,
        [name]: value,
      };
    });
  }
  ////////////////////////////




    const addUser = () => {
        // console.log(name)
        Axios.post('https://sql-connect.herokuapp.com/create',
            { firstName: firstName, lastName: lastName, email:email, phone:phone,password:password }
        ).then(() => {
            console.log("success");
        })
    }

    // open create account popup form
    const createForm = () => {
        var createModal = document.getElementById("createAccountModal");
        var span = document.getElementsByClassName("close2")[0];
        createModal.style.display = "block";
        span.onclick = function() {
            createModal.style.display = "none";
          }
        window.onclick = function(event) {
            if (event.target === createModal) {
                createModal.style.display = "none";
            }
          }
    }
    // open sign in popup form
    const signInForm = () => {
        var signInModal = document.getElementById("signInModal");
        var span = document.getElementsByClassName("close")[0];
        signInModal.style.display = "block";
        span.onclick = function() {
            signInModal.style.display = "none";
          }
        window.onclick = function(event) {
            if (event.target === signInModal) {
                signInModal.style.display = "none";
            }
          }
    }
    // close sign in form and open create account form
    const closeSignIn = () => {
        var signInModal = document.getElementById("signInModal");
        signInModal.style.display = "none";
        createForm();
    }
    // close create account form and open sign in form
    const closeCreateAccount = () => {
        var createModal = document.getElementById("createAccountModal");
        createModal.style.display = "none";
        signInForm();
    }
    
    return <div>  
        <div className="HomePage">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
            <div className="header">
                <div className="header-bkgrnd"></div>
                <div className='banner'></div> 
                <div className="accountIcon">
                    <span class="material-icons">account_circle</span>
                </div>
                <div className="expandIcon">
                    <span class="material-icons">expand_more</span>
                </div>
                <div class="dropdown" >
                    <button class="dropbtn">My Account</button>
                    <div class="dropdown-content">
                        <div className="signIn">
                            <button className="signInBtn" onClick={signInForm}>Sign In</button>


                            <div id="signInModal" class="modal">
                                <div class="modal-content">
                                    <span class="close">&times;</span>            
                                    <label>{loginStatus}</label>
                                    <label className="sign-in-label">Sign In</label>
    <div>
        <input
          onChange={handleSignInFields}
          type="text" 
          name="email"
          value={signfield.email}
          className="form-control sign-in-email"
          placeholder="Email"
        ></input>
      </div>
      <div>
        <input
          onChange={handleSignInFields}
          type="password"
          name="password"
          value={signfield.password}
          className="form-control sign-in-passwrd"
          placeholder="Password"
        ></input>
      </div>
                                   
                                    <button className="sign-in-btn" onClick={signInHandler}>Sign In</button>
                                    <button className="create-acc-btn" onClick={closeSignIn}>Create Account</button>
                                </div>
                            </div>

                        </div>
                        <div className="createAccount">
                            <button id="myBtn" className="createAccountBtn" onClick={createForm}>Create Account</button>


                            <div id="createAccountModal" class="modal">
                                <div class="modal-content">
                                    
                                    <span class="close2">&times;</span>

                                    <div className="createMssg">
                                        <label className="cMssg1">Create Account </label> <br/>
                                        <label className="cMssg2">If you already have an account </label>
                                        <button className="signInBtn" onClick={closeCreateAccount}>Sign In</button>
                                    </div>
                                   
                                    <input type="text" className="create-fname" placeholder = "First Name" onChange={(event) => { setFirstName(event.target.value); }} />
                                    
                                    <input type="text" className="create-lname" placeholder = "Last Name" onChange={(event) => { setLastName(event.target.value); }} />
                                    
                                    <input type="text" className="create-phone" placeholder = "Phone Number" onChange={(event) => { setPhone(event.target.value); }} />
                                   
                                    <input type="text" className="create-email" placeholder = "Email" onChange={(event) => { setEmail(event.target.value); }} />
                               
                                    <input type="password" className="create-passwd" placeholder = "Password" onChange={(event) => { setPassword(event.target.value); }} />

                                    

                                    <button className="createAccBtn" onClick={addUser}>Create Account</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shopingCart">
                    <Link to="/cart">
                        <button>
                            <span class="material-icons">shopping_cart</span>
                        </button>
                        </Link> <br/>
                </div>
                <Link to="/">
                    <button className="homeBtn">
                        <img src={require("../logo.jpg")} alt="logo" height= "90px"></img>
                    </button>
                </Link>

                <div className="search"> 
                    <input type="text" placeholder="Search by Title, Author or ISBN"/>
                    <div className="searchButton">
                        <button>
                            <span class="material-icons">search</span>
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
        <Outlet /> 
        </div>
    </div>;
}

export default Header;
