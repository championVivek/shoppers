import React, { useEffect, useState, useContext } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import NumberFormat from "react-number-format";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { useParams, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BasketContext from "../Context/basketContext";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "./Cart.css";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalSum, setTotalSum] = useState();
  const [isLoading, setIsLoading] = useState();
  const { userData } = useContext(UserContext);
  const { setBasket } = useContext(BasketContext);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      setIsLoading(true);
      const product = await axios.post("/getcart", { userId: id });
      setIsLoading(false);
      setCartProducts(product.data);
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  useEffect(() => {
    if (userData.user) {
      axios.post("/gettotal", { userId: userData.user.id }).then((totalsum) => {
        setBasket(totalsum.data.totalQuantity);
        setTotalSum(totalsum.data.total);
      });
    }
  });
  
  const proceedToBuy = () => {
    history.push(`/checkout`);
  };

  const handleDelete = async (e) => {
    try {
      setIsLoading(true);
      const product = await axios.post(`/deleteproductincart/${id}`, {
        productId: e.target.value,
      });
      setIsLoading(false);
      setCartProducts(product.data);
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
        <div className="cartproducts__list">
          {cartProducts.length <= 0 ? (
            <h1>Cart is empty!!</h1>
          ) : (
            <React.Fragment>
              <ToastContainer />
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
                      <Card.Text>
                        Price:{" "}
                        <NumberFormat
                          value={data.productId.price}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </Card.Text>
                    </div>
                  </Card.Body>
                  <div className="cartproducts__footer">
                    <h4>
                      Sub-total:{" "}
                      <NumberFormat
                        value={data.quantity * data.productId.price}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₹"}
                      />
                    </h4>
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
                <div className="checkout__total">
                  Total:{" "}
                  <NumberFormat
                    value={totalSum}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </div>
                <div className="checkout__button">
                  <Button onClick={proceedToBuy}>
                    <FlashOnIcon />
                    Proceed to Buy
                  </Button>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default Cart;
