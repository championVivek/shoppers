import React, { useEffect, useContext, useState } from "react";
import UserContext from "../Context/userContext";
import { Button } from "react-bootstrap";
import { saveAs } from "file-saver";
import axios from "../../Axios";
import "./Orders.css";

function Orders() {
  const { userData } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.post("/myorders", { userId: userData.user.id }).then((orders) => {
      setOrders(orders.data);
    });
  }, []);

  const handleInvoice = async (e) => {
    const getpdf = await axios.post("/makeinvoice", {
      orderId: e.target.value,
      userId: userData.user.id,
    });
    if (getpdf) {
      const result = await axios.post(
        "/getinvoice",
        { orderId: e.target.value },
        { responseType: "blob" }
      );
      const pdfblob = new Blob([result.data], { type: "application/pdf" });
      saveAs(pdfblob, "invoice.pdf");
    }
  };

  return (
    <div>
      {orders.length <= 0 ? (
        <h1>Nothing Here!</h1>
      ) : (
        <React.Fragment>
          <ul className="orders">
            {orders.map((orders, index) => (
              <li key={index} className="orders__item">
                <div className="orders__item__header">
                  <div>
                    Order - # {orders._id} -{" "}
                    <Button
                      variant="link"
                      onClick={handleInvoice}
                      value={orders._id}
                    >
                      Invoice
                    </Button>
                  </div>
                </div>
                <ul className="orders__products">
                  {orders.products.map((product, index) => (
                    <li className="orders__products-item" key={index}>
                      {product.product.title}
                      <li className="orders__products-item__quantity">
                        Quantity: ({product.quantity})
                      </li>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </div>
  );
}

export default Orders;
