import React, { useState, useEffect, useContext } from "react";
import { Card, Button, CardGroup, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import NumberFormat from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../Context/userContext";
import BasketContext from "../Context/basketContext";
import axios from "../../Axios";
import "./Home.css";

function Home() {
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const { state } = useContext(UserContext);
  const { setBasket } = useContext(BasketContext);
  const history = useHistory();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const products = await axios.get("/products");
      setIsLoading(false);
      setDetails(products.data);
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  const addToBasket = (e) => {
    if (state.isAdmin === "true" || state.id === undefined) {
      toast.dark("You have to Login as user to buy an item!", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setIsLoading(true);
      axios
        .post("/cart", { id: e.target.value, userId: state.id })
        .then((result) => {
          setIsLoading(false);
          setBasket(result.data.totalQuantity);
        });
    }
  };

  const buyNow = (e) => {
    if (state.isAdmin === "true" || state.id === undefined) {
      toast.dark("You have to Login as user to buy an item!", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setIsLoading(true);
      axios
        .post("/cart", { id: e.target.value, userId: state.id })
        .then((result) => {
          setIsLoading(false);
          history.push(`/basket/${state.id}`);
        });
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className="products__list">
          <CardGroup>
            <ToastContainer />
            <React.Fragment>
              {details.map((data, index) => (
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
                        variant="info"
                        value={data._id}
                        onClick={addToBasket}
                      ><ShoppingCartIcon/>
                        Add to cart
                      </Button>
                      <Button
                        variant="warning"
                        value={data._id}
                        onClick={buyNow}
                      ><FlashOnIcon/>
                        Buy Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </React.Fragment>
          </CardGroup>
        </div>
      )}
    </React.Fragment>
  );
}

export default Home;
