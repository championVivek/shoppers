import { Card, Button, CardGroup } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "./products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    fetchProducts();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const product = await axios.post(`admin/${userData.user.id}/products`);
        setProducts(product.data);
        console.log(userData.user.id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (e) => {
     axios.post(`admin/${userData.user.id}/deleteproducts`, {
      productId: e.target.value,
    });
  };

  const handleEdit = (e) => {
    history.push(`/admin/${e.target.value}/editproduct`);
  };

  return (
    <div className="products__list">
         <CardGroup>
          {products.map((data, index) => (
            <Card key={index}>
              <Card.Img
                variant="top"
                src={`http://localhost:4000/${data.imageUrl}`}
              />
              <Card.Body>
                <Card.Title>{data.title}</Card.Title>
                <Card.Text>Price: ₹ {data.price}</Card.Text>
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

   </div>
  );
}

export default Products;
