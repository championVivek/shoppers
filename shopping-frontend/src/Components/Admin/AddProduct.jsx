import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "./Add_product.css";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState();
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const fileUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    var formdata = new FormData();
    formdata.append("file", image);
    formdata.append("title", title);
    formdata.append("price", price);
    formdata.append("id", userData.user.id);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    await axios.post("/addproducts", formdata, config);
    console.log("product added");
    history.push(`/admin/${userData.user.id}/products`);
  };

  return (
    <div className="AddProduct">
      <div className="AddProduct__body">
        <h3>Add products</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.File
              id="custom-file"
              label="Choose image"
              onChange={fileUpload}
            />
          </Form.Group>
          <div className="addproduct__button"> 
          <Button variant="success" type="submit">
            Add
          </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddProduct;
