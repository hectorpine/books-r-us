import "./App.css";
import Axios from "axios";
import React, { useState } from "react";
import { Image } from "cloudinary-react";

function App() {
  const [imageSelected, setImageSelected] = useState("");
  const uploadImage = () => {
    //console.log(files[0]);
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "szmmcxr6");
    Axios.post(
      "https://api.cloudinary.com/v1_1/team72022/image/upload",
      formData
    ).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageSelected(event.target.files[0]);
        }}
      />
      <button onClick={uploadImage}> Upload Image </button>

      <Image
        style={{ width: 200, height: 200 }}
        cloudName="team72022"
        publicId="https://res.cloudinary.com/team72022/image/upload/v1649440447/epodjtcmlrhraabtrvcj.jpg"
      />
    </div>
  );
}

export default App;
