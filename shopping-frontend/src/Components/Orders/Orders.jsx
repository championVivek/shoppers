import React, { useEffect, useContext, useState } from "react";
import UserContext from "../Context/userContext";
import { toast, ToastContainer } from "react-toastify";
import { Button, Spinner } from "react-bootstrap";
import { saveAs } from "file-saver";
import axios from "../../Axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const { state } = useContext(UserContext);
  
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await axios.post("/myorders", { userId: state.id });
      setIsLoading(false);
      setOrders(orders.data);
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  const handleInvoice = async (e) => {
    try {
      setIsLoading(true);
      const getpdf = await axios.post("/makeinvoice", {
        orderId: e.target.value,
        userId: state.id,
      });
      if (getpdf) {
        setIsLoading(true);
        const result = await axios.post(
          "/getinvoice",
          { orderId: e.target.value },
          { responseType: "blob" }
        );
        setIsLoading(false);
        const pdfblob = new Blob([result.data], { type: "application/pdf" });
        saveAs(pdfblob, "invoice.pdf");
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
        <div>
          <ToastContainer />
          {orders.length <= 0 ? (
            <h1>Nothing Here!</h1>
          ) : (
            <React.Fragment>
              <div className="orders">
                {orders.map((orders, index) => (
                  <div key={index} className="orders__item">
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
                    <div className="orders__products">
                      {orders.products.map((product, index) => (
                        <div className="orders__products-item" key={index}>
                          {product.product.title}
                          <div className="orders__products-item__quantity">
                            Quantity: ({product.quantity})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default Orders;
