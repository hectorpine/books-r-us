import { useState, useReducer, useEffect } from 'react';
import './font.css';
import './css/Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const Home = () => {
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
  const [searchKey, setSearchKey] = useState('');
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

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <div className="homepage-bkg"></div>

      <div className="search">
        <input
          type="text"
          placeholder="Search by Title or Author"
          onChange={(event) => {
            setSearchKey(event.target.value);
          }}
        />
        <div className="searchButton">
          {/**   <button>
                            <span class="material-icons">search</span>
                        </button> */}
        </div>
      </div>

      <div class="filter-dropdown">
        <button class="filter-search-btn">
          Filter Search
          <span class="material-icons filter-expand">expand_more</span>
        </button>

        <div class="filter-btn-container">
          <button onClick={() => sortCheapItems(products)}>
            Price: Low to High
          </button>
          <button onClick={() => sortExpensiveItems(products)}>
            Price: High to Low
          </button>
          <button onClick={() => sortMostItems(products)}>In Stock</button>
        </div>
      </div>

      {/**INVENTORY PRODUCT DISPLAY */}
      <div>
        {/**SORTING BUTTONS */}
        {/** */}
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
              <div
                key={product._id}
                sm={1}
                md={4}
                lg={3}
                className="display-books"
              >
                <img class="product-img" src={product.image} alt=""></img>
                <div class="quick-view-bkgrnd"> </div>
                <Link id="view-book-btn" to={`/${product._id}`}>
                  <button id="qv-btn" className="quick-view-btn">
                    View Book
                  </button>
                </Link>
              </div>
            ))}
        </div>
        {/**INVENTORY PRODUCT DISPLAY */}
      </div>
    </div>
  );
};

export default Home;
