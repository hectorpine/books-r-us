import { useState, useReducer, useEffect } from 'react';
import './font.css';
import './css/Home.css'
import axios from 'axios';


////This is needed to load all of the books and to load all of the cart items
///For more info please see " React hooks, useReducer()"
const reducer = (state, action) => {
  switch (action.type) {
    case 'PULL_INVENTORY':
      return { ...state, products: action.payload, loading: false };
    case 'RETRIEVE_CART':
      console.log('reducer()');
      return { ...state, inCart: action.payload, loading: false };
    default:
      return state;
  }
};
////////////////////////////////////////////////////////////////////////////




const Home = () =>{

  //This is where the "products" and "inCart" objects are declared as arrays,
  // these arrays are declared from an empty state, when the reducer function is
  //dispatched, an axios request is made to an express router in order to retrieve
  //the list of "product" objects as an array.
  const [{ products }, dispatch] = useReducer(reducer, {
    products: [],
    inCart: [],
  });
  ////////////////////////////////////////////////////////////////////////////

  /////useState  hook used to compare and filter through matching strings
  ////within the book title or author name
  const [searchKey] = useState('');
  /////////////////////////////////////////////////////////////////////

  /////useEffect() hook sends get request to load "products" array,
  /////as well as inCart array via their reducer functions
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/books');
      dispatch({ type: 'PULL_INVENTORY', payload: result.data });
    };
    const fetchCart = async () => {
      const mongoCart = await axios.get('/api/cartitems');
      console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };

    fetchData();
    console.log('fetchCart()');
    fetchCart();
  }, []);
  //////////////////////////////////////////////////////////

  //useEffect() hook used to refresh cart upon additional
  //addition to cart
  useEffect(() => {
    const fetchCart = async () => {
      const mongoCart = await axios.get('/api/cartitems');
      console.log(mongoCart.data);
      dispatch({ type: 'RETRIEVE_CART', payload: mongoCart.data });
    };
    fetchCart();
  });
  /////////////////////////////////////////////////////////




  //addToCart() handler takes in a "product" object
  ////from the "products" array, and takes necessary
  ///fields to create a "newCartItem" object which is then
  ///posted inside "cartitems" database
  function addToCart(product) {
    const newCartItem = {
      itemId: product._id,
      title: product.title,
      quantity: 1,
      price: product.price,
    };
    console.log('BEFORE posting to cart');
    axios.post('/api/cartitems/addToCart', newCartItem);
    console.log('AFTER posting to cart');
  }
  ////////////////////////////////////////////




  ///SORTING BUTTON FUNCTIONS
  const sortExpensiveItems = (products) => {
    function highToLowPrice(a, b) {
      return b.price - a.price;
    }
    products.sort(highToLowPrice);
  };

  const sortCheapItems = (products) => {
    function lowToHighPrice(a, b) {
      return a.price - b.price;
    }
    products.sort(lowToHighPrice);
  };

  const sortMostItems = (products) => {
    function highestStock(a, b) {
      return b.stock - a.stock;
    }
    products.sort(highestStock);
  };

  const sortLeastItems = (products) => {
    function lowestStock(a, b) {
      return a.stock - b.stock;
    }
    products.sort(lowestStock);
  };
  ////////////////////////////////////


  

/*
  var modal = document.getElementById("qv-modal");

// Get the button that opens the modal
var btn = document.getElementById("qv-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
*/




    
    return <div> 
        

                  {/**INVENTORY PRODUCT DISPLAY */}
      <div>
        {/**SORTING BUTTONS */}
        <button onClick={() => sortExpensiveItems(products)}>
          {' '}
          Sort by $$$
        </button>
        <button onClick={() => sortCheapItems(products)}> Sort by $</button>
        <button onClick={() => sortMostItems(products)}> Highest Stock</button>
        <button onClick={() => sortLeastItems(products)}> Short Supply</button>
        <div className="homepage-book-container">
        {/**SORTING BUTTONS */}
        {/*SERACH BAR RESULTS : If the user has typed in the search bar, it will filter for these first before displaying anything*/}
        {products
          .filter((product) => {
            if (searchKey === '') {
              return product;
            } else if (
              product.title.toLowerCase().includes(searchKey.toLowerCase()) ||
              product.author.toLowerCase().includes(searchKey.toLowerCase())
            ) {
              return product;
            }
          })
          /**SERACH BAR FILTER END */
          /**Product display. A "product" is a single element from the "products" array. Below is the html for displaying a single "product" */
          .map((product) => (
            <div key={product._id} sm={1} md={4} lg={3} className="display-books">

              <img class='product-img'
                src={product.image}
                alt=""
              ></img>
              <div class="quick-view-bkgrnd"> </div> 

              
              <button id="qv-btn" class="quick-view-btn">Quick View</button>

           
              <div id="qv-modal" class="quick-view-modal">
                <div class="qv-content">
                  <span class="close">&times;</span>
                  <p>Some text in the Modal..</p>
                </div>
              </div>  
              
            
            </div>
            
          ))}
      </div>
      {/**INVENTORY PRODUCT DISPLAY */}

        </div>
    </div>
   
}

export default Home;
