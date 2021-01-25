import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Spinner } from "react-bootstrap";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "./Add_product.css";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState();
  const { state } = useContext(UserContext);
  const history = useHistory();

  const fileUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      var formdata = new FormData();
      formdata.append("file", image);
      formdata.append("title", title);
      formdata.append("price", price);
      formdata.append("id", state.id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      setIsLoading(true);
      await axios.post("/addproducts", formdata, config);
      setIsLoading(false);
      history.push(`/admin/products`);
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner animation="border" role="status" variant="warning">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className="AddProduct">
          <ToastContainer />
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
      )}
    </React.Fragment>
  );
}

export default AddProduct;
