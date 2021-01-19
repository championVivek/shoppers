import React, { useState, useEffect, useContext } from "react";
import { Card, Button, CardGroup } from "react-bootstrap";
import {useHistory} from "react-router-dom"
import UserContext from "../Context/userContext";
import BasketContext from "../Context/basketContext";
import axios from "../../Axios";
import "./Home.css";

function Home() {
  const [details, setDetails] = useState([]);
  const { userData } = useContext(UserContext);
  const { setBasket } = useContext(BasketContext);
  const history = useHistory();
   
  useEffect(() => {
    axios
      .get("/products")
      .then((result) => {
        setDetails(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addToBasket = (e) => {
    if (userData.isAdmin === "true" || userData.user === undefined) {
      alert("You have to Login as user to but an item!");
    } else {
      axios.post("/cart", { id: e.target.value, userId: userData.user.id });
    }
  };

  const buyNow = (e) => {
    if (userData.isAdmin === "true" || userData.user === undefined) {
      alert("You have to Login as user to buy an item!");
    } else {
      axios.post("/cart", { id: e.target.value, userId: userData.user.id });
      history.push(`/basket/${userData.user.id}`)
    }
  }
 
  return (
    <div className="products__list">
      <CardGroup>
        <React.Fragment>
          {details.map((data, index) => (
            <Card key={index}>
              <Card.Img
                variant="top"
                src={`http://localhost:4000/${data.imageUrl}`}
              />
              <Card.Body>
                <Card.Title>{data.title}</Card.Title>
                <Card.Text>Price: ₹ {data.price}</Card.Text>
                <div className="card__buttons">
                  <Button variant="info" value={data._id} onClick={addToBasket}>
                    Add to cart
                  </Button>
                  <Button variant="warning" value={data._id} onClick={buyNow}>Buy Now</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </React.Fragment>
      </CardGroup>
    </div>
  );
}

export default Home;
