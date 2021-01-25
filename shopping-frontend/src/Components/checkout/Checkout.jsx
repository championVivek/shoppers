import React, { useContext, useState, useEffect } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import NumberFormat from "react-number-format"
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import UserContext from "../Context/userContext";
import { useHistory } from "react-router-dom";
import axios from "../../Axios";
import "./Checkout.css";

const getDataFromServer = async () => {
  const Stripekey = await axios.get("/sendpikey");
  return Stripekey.data;
};

const stripePromise = getDataFromServer().then((res) => {
  return loadStripe(res);
});

function Checkout() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalSum, setTotalSum] = useState();
  const [isLoading, setIsLoading] = useState();
  const { state } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    axios.post("/getcart", { userId: state.id }).then((product) => {
      setIsLoading(false);
      setCartProducts(product.data);
    });
    axios.post("/gettotal", { userId: state.id }).then((totalsum) => {
      setTotalSum(totalsum.data.total);
    });
  }, []);

  const Checkout = async () => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        // Stripe.js has not yet loaded.
        // Make  sure to disable form submission until Stripe.js has loaded.
        return;
      }
      setIsLoading(true);
      const res = await axios.post("/checkout", { userId: state.id });
      const clientSecret = res.data.id;
      setIsLoading(true);
      const result = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });
      if (result.error) {
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setIsLoading(false);
          history.push("/");
        }
      }
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
        <div className="checkoutproducts__list">
          <ToastContainer />
          {cartProducts.map((data, index) => (
            <Card key={index} className="checkoutproducts__card">
              <Card.Body>
                <div className="checkoutproducts__title">
                  <Card.Title>{data.productId.title}</Card.Title>
                  <Card.Text className="checkout__quantity">
                    Quantity: {data.quantity}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          ))}
          <div className="checkout">
            <div className="checkout__total">Total: <NumberFormat value={totalSum} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
            <div className="checkout__button">
              <Button onClick={Checkout}>PLACE ORDER</Button>
            </div>{" "}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Checkout;
