import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../Axios";
import "./Cart.css";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalSum, setTotalSum] = useState();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    axios.post("/getcart", { userId: id }).then((product) => {
      setCartProducts(product.data);
    });
    axios.post("/gettotal", { userId: id }).then((totalsum) => {
      setTotalSum(totalsum.data.total);
    });
  }, [cartProducts]);

  const proceedToBuy = () => {
    history.push(`/checkout`);
  };

  const handleDelete = (e) => {
    console.log(e.target.value);
    axios.post(`/deleteproductincart/${id}`, { productId: e.target.value });
  };

  return (
    <div className="cartproducts__list">
      {cartProducts.length <= 0 ? (
        <h1>Cart is empty!!</h1>
      ) : (
        <React.Fragment>
          {cartProducts.map((data, index) => (
            <Card key={index} className="cartproducts__card">
              <Card.Body>
                <Card.Img
                  variant="top"
                  src={`http://localhost:4000/${data.productId.imageUrl}`}
                />
                <div className="cartproducts__title">
                  <Card.Title>{data.productId.title}</Card.Title>
                  <Card.Text className="card__quantity">
                    Quantity: {data.quantity}
                  </Card.Text>
                  <Card.Text>Price: ₹ {data.productId.price}</Card.Text>
                </div>
              </Card.Body>
              <div className="cartproducts__footer">
                <h4>Sub-total: ₹ {data.quantity * data.productId.price}</h4>
                <Button
                  variant="danger"
                  value={data.productId._id}
                  onClick={handleDelete}
                >
                  Remove from Cart
                </Button>
              </div>
            </Card>
          ))}
          <div className="checkout">
            <div className="checkout__total">Total: ₹ {totalSum}</div>
            <div className="checkout__button">
              <Button onClick={proceedToBuy}>Proceed to Buy</Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Cart;
