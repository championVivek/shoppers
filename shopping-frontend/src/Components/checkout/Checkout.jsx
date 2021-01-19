import React, { useContext, useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import UserContext from "../Context/userContext";
import { loadStripe } from "@stripe/stripe-js";
import { useHistory } from "react-router-dom";
import axios from "../../Axios";
import "./Checkout.css";

const getDataFromServer = async () => {
  const Stripekey = await axios.get("/sendpikey");
  return Stripekey.data;
}

const stripePromise = getDataFromServer().then((res) => {
  return loadStripe(res);
 })

 

function Checkout() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalSum, setTotalSum] = useState();
  const { userData } = useContext(UserContext);
  const history = useHistory();
  
  useEffect(() => {
    axios.post("/getcart", { userId: userData.user.id }).then((product) => {
      setCartProducts(product.data);
    });
    axios.post("/gettotal", { userId: userData.user.id }).then((totalsum) => {
      setTotalSum(totalsum.data.total);
    });
  }, []);

  const Checkout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await axios.post("/checkout", { userId: userData.user.id });
    const clientSecret = res.data.id;
    const result = await stripe.redirectToCheckout({
      sessionId: clientSecret,
    });
    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Money is in the bank");
        history.push("/");
      }
    }
  };

  return (
    <div className="checkoutproducts__list">
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
        <div className="checkout__total">Total: ₹ {totalSum}</div>
        <div className="checkout__button">
          <Button onClick={Checkout}>Order Now</Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
