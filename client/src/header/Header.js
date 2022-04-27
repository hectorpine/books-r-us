import React from 'react';
import './Header.css';
import '../pages/font.css';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  ///hook used to get information from user input fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  ////////////////////////////////////////////////////////////////////////////////////

  ///hook for SIGN IN form functionality
  const [signfield, setSignIn] = useState({
    email: '',
    password: '',
  });
  ////////////////////////////////////////////////////////////////////////////////////

  ///NEW USER CREATION HANDLER
  function createUser(event) {
    event.preventDefault();
    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    console.log(newUser);
    axios.post('/api/users/newaccount', newUser);
  }
  ////////////////////////////////////////////////////////////////////////////////////

  /// user registration form field changes
  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value,
      };
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////

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
  ////////////////////////////////////////////////////////////////////////////////////

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
    localStorage.setItem('user', JSON.stringify(loggedUser));
    console.log('this local', JSON.parse(localStorage.getItem('user')));
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // open create account popup form
  const createForm = () => {
    var createModal = document.getElementById('createAccountModal');
    var span = document.getElementsByClassName('close2')[0];
    createModal.style.display = 'block';
    span.onclick = function () {
      createModal.style.display = 'none';
    };
    window.onclick = function (event) {
      if (event.target === createModal) {
        createModal.style.display = 'none';
      }
    };
  };
  ////////////////////////////////////////////////////////////////////////////////////
  // open sign in popup form
  const signInForm = () => {
    var signInModal = document.getElementById('signInModal');
    var span = document.getElementsByClassName('close')[0];
    signInModal.style.display = 'block';
    span.onclick = function () {
      signInModal.style.display = 'none';
    };
    window.onclick = function (event) {
      if (event.target === signInModal) {
        signInModal.style.display = 'none';
      }
    };
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // close sign in form and open create account form
  const closeSignIn = () => {
    var signInModal = document.getElementById('signInModal');
    signInModal.style.display = 'none';
    createForm();
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // close create account form and open sign in form
  const closeCreateAccount = () => {
    var createModal = document.getElementById('createAccountModal');
    createModal.style.display = 'none';
    signInForm();
  };
  ////////////////////////////////////////////////////////////////////////////////////
  const loggedOn = JSON.parse(localStorage.getItem('user'));

  function signUserOut() {
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <div>
      <div className="HomePage">
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <div className="header">
          <div className="header-bkgrnd"></div>
          <div className="banner"></div>

          <div class="dropdown">
            <div className="accountIcon">
              <span class="material-icons">account_circle</span>
            </div>
            <div className="expandIcon">
              <span class="material-icons">expand_more</span>
            </div>
            <button class="dropbtn">
              {loggedOn ? <text>{loggedOn.name}</text> : 'Hi, Sign In!'}
            </button>
            <div class="dropdown-content">
              <div className="signIn">
                {loggedOn ? (
                  <button className="signInBtn" onClick={signUserOut}>
                    Sign Out
                  </button>
                ) : (
                  <button className="signInBtn" onClick={signInForm}>
                    Sign In
                  </button>
                )}

                <div id="signInModal" class="modal">
                  <div class="modal-content">
                    <span class="close">&times;</span>
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
                    <button className="sign-in-btn" onClick={signInHandler}>
                      Sign In
                    </button>
                    <button className="create-acc-btn" onClick={closeSignIn}>
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
              <div className="createAccount">
                {loggedOn ? (
                  ''
                ) : (
                  <button
                    id="myBtn"
                    className="createAccountBtn"
                    onClick={createForm}
                  >
                    Create Account{/**shows up in popup */}
                  </button>
                )}

                <div id="createAccountModal" class="modal">
                  <div class="modal-content">
                    <span class="close2">&times;</span>

                    <div className="createMssg">
                      <label className="cMssg1">Create Account </label> <br />
                      <label className="cMssg2">
                        If you already have an account{' '}
                      </label>
                      <button
                        className="signInBtn"
                        onClick={closeCreateAccount}
                      >
                        Sign In
                      </button>
                    </div>

                    <div>
                      <input
                        onChange={handleFormChange}
                        type="text"
                        name="name"
                        value={form.name}
                        className="form-control create-fname"
                        placeholder="Name"
                      ></input>
                    </div>
                    <div>
                      <input
                        onChange={handleFormChange}
                        type="text"
                        name="email"
                        value={form.email}
                        className="form-control create-email"
                        placeholder="E-mail"
                      ></input>
                    </div>
                    <div>
                      <input
                        onChange={handleFormChange}
                        type="password"
                        name="password"
                        value={form.password}
                        className="form-control create-passwd"
                        placeholder="Password"
                      ></input>
                    </div>
                    <button className="createAccBtn" onClick={createUser}>
                      Create Account
                    </button>
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
            </Link>{' '}
            <br />
          </div>
          <Link to="/">
            <button className="homeBtn">
              <img src={require('../logo.jpg')} alt="logo" height="90px"></img>
            </button>
          </Link>
        </div>
        <hr />
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
