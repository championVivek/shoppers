import React, { useEffect, useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast} from "react-toastify"
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import UserContext from "../../Context/userContext";
import axios from "../../../Axios";
import "./EditProduct.css";

function EditProduct() {
  const [newImage, setNewImage] = useState();
  const { state } = useContext(UserContext);
  const { id } = useParams();
  const { handleSubmit, setValue, register } = useForm();
  const history = useHistory();

  useEffect(() => {
    axios
      .post(`/admin/${id}/geteditproduct`, { id: state.id })
      .then((result) => {
        setValue("title", result.data.title);
        setValue("price", result.data.price);
      });
  }, []);

  const fileUpload = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const onSubmit = async (data) => {
    try {
      var formdata = new FormData();
      formdata.append("file", newImage);
      formdata.append("title", data.title);
      formdata.append("price", data.price);
      formdata.append("adminId", state.user.id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const isUpdated = await axios.post(`/admin/${id}/editproduct`, formdata, config);
      toast.success(isUpdated.data.msg, {autoClose: 2000})
      history.push(`/admin/${state.id}/products`);
    } catch (err) {
      toast.error(err.response.data.msg, {autoClose: 2000})
    }
  };

  return (
    <div className="EditProduct">
      <ToastContainer />
      <div className="EditProduct__body">
        <h3>Edit product</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              ref={register}
              name="title"
              type="text"
              placeholder="Enter title"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              ref={register}
              name="price"
              type="number"
              placeholder="Enter price"
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
          <div className="editproduct__button">
            <Button variant="success" type="submit">
              Edit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditProduct;
