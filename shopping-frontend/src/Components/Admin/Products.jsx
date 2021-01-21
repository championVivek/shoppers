import { Card, Button, CardGroup, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "./products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const product = await axios.post(`admin/${userData.user.id}/products`);
      setIsLoading(false);
      setProducts(product.data);
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  const handleDelete = async (e) => {
    try {
      setIsLoading(true);
      const deleteProduct = await axios.post(
        `admin/${userData.user.id}/deleteproducts`,
        {
          productId: e.target.value,
        }
      );
      setIsLoading(false);
      setProducts(deleteProduct.data.products);
      toast.success(deleteProduct.data.msg, { autoClose: 2000 });
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  const handleEdit = (e) => {
    history.push(`/admin/${e.target.value}/editproduct`);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner animation="border" role="status" variant="warning">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className="products__list">
          <ToastContainer />
          {products.length <= 0 ? (
            <h1>No products</h1>
          ) : (
            <CardGroup>
              {products.map((data, index) => (
                <Card key={index}>
                  <Card.Img
                    variant="top"
                    src={`http://localhost:4000/${data.imageUrl}`}
                  />
                  <Card.Body>
                    <Card.Title>{data.title}</Card.Title>
                    <Card.Text>Price: <NumberFormat value={data.price} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></Card.Text>
                    <div className="card__buttons">
                      <Button
                        variant="danger"
                        value={data._id}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        value={data._id}
                        onClick={handleEdit}
                      >
                        Edit product
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </CardGroup>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default Products;
