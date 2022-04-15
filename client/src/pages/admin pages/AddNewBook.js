import React from "react";
import './css/AddNewBook.css';
import '../font.css';
import { useState } from 'react';
import axios from 'axios';


const AddNewBook = () =>{

  ////useState() hook used to create and "input" object that
  ///includes all of the needed fields to create new book item
  const [input, setInput] = useState({
    title: '',
    author: '',
    reference: '',
    genre: '',
    image: '',
    price: '',
    stock: '',
    description: '',
  });
  ///////////////////////////////////////////////////////////

  ////handleChange() is the handler used to manage changing
  ///text input within each field of the "New Sale Item" form
  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }
  ////////////////////////////////////////////////////

  ///onClick handler for "New Sale Item" form
  ///Creates a "newBook" object, and sends post
  ///request to database
  function createItemClick(event) {
    event.preventDefault();
    const newBook = {
      title: input.title,
      author: input.author,
      reference: input.reference,
      genre: input.genre,
      image: input.image,
      price: input.price,
      stock: input.stock,
      description: input.description,
    };
    axios.post('/api/books', newBook);
  }
  ///////////////////////////////////////////////

    function showPreview(event){
        if(event.target.files.length > 0){
          var src = URL.createObjectURL(event.target.files[0]);
          var preview = document.getElementById("bookCoverPreview");
          preview.src = src;
          preview.style.display = "block";
        }
      }

    
    return <div> 
        <div className="newBook">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>

            <div className="bookImg">
                <div className="coverDisplay">
                    <div class="image">
                        <img id="bookCoverPreview" alt=""/>
                    </div>
                    <span class="material-icons addPhoto">photo_library</span>
                </div>
                <label for="imgBtn">Upload Image</label>
                <input type="file" id="imgBtn" accept="image/*" onChange={showPreview} />
            </div>

            <div className="bookInfo">
                <label>Title</label>
                <input 
                    type="text"
                    onChange={handleChange}
                    name="title"
                    value={input.title}
                    className="form-control"
                ></input>

                <label>Author</label>
                <input
                    type="text"
                    onChange={handleChange}
                    name="author"
                    value={input.author}
                    className="form-control"
                ></input>

                <label>ISBN</label>
                <input
                    type="number"
                    onChange={handleChange}
                    name="reference"
                    value={input.reference}
                    className="form-control"
                ></input>

                <label>Genre</label>
                <input
                    type="text"
                    onChange={handleChange}
                    name="genre"
                    value={input.genre}
                    className="form-control"
                ></input>

                <label>Description</label>
                <textarea
                    rows="5"
                    onChange={handleChange}
                    name="description"
                    value={input.description}
                    className="form-control"
                ></textarea>

                <label>Price ($)</label>
                <input
                    type="number"
                    onChange={handleChange}
                    name="price"
                    value={input.price}
                    className="form-control"
                ></input>

                <label>Qty.</label>
                <input
                    type='number'
                    onChange={handleChange}
                    name="stock"
                    value={input.stock}
                    className="form-control"
                ></input>

                <button className="addBookBtn" onClick={createItemClick}>Add New Book</button>
            </div>
        </div>
    </div>
}

export default AddNewBook;