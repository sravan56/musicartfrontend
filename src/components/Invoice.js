import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/Invoice.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";
import { FaArrowLeft } from "react-icons/fa";

const Invoice = ({ isLoggedIn, handleLogout,userName }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState("");

  const isMobile = window.innerWidth <= 768;
  const baseURL='https://musicartbackend-a7k3.onrender.com';

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/order/getorder/${orderId}`
        );
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.mainContainer}>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Navbar />
      <div className={style.invoiceContainer}>
        
        {isMobile ? (
          <div className={style.BackLink}>
            <FaArrowLeft className={style.arrowIcon} onClick={handleBack} />
            <h2 className={style.invoiceHeader}>Invoice</h2>
          </div>
        ) : (
          <div className={style.BackLink}>
            <button onClick={handleBack} className={style.backButton}>
              Back to products
            </button>
            <h2 className={style.invoiceHeader}>Invoice</h2>
          </div>
        )}
        

        <div className={style.invoiceContent}>
          <div className={style.invoiceDivision}>
            <div className={style.invoiceSection}>
              <h3>1.Delivery Address</h3>
              <div className={style.userAdress}>
              <p>{userName}</p>
              <p>{order.deliveryAddress}</p>
              </div>
            </div>
            <hr />
            <div className={style.invoiceSection}>
              <h3>2.Payment Method: </h3>
              <div className={style.paytype}>
              <p >{order.paymentMethod}</p>
              </div>
              
            </div>
            <hr />
            <div className={style.invoiceSection}>
              <h3>3.Review Items and Delivery</h3>
              <div>
              <div className={style.cartItems}>
                {order.cartItems.map((item) => (
                  <div key={item._id} className={style.cartItem}>
                    {item &&
                      item.productId.images &&
                      item.productId.images.length > 0 && (
                        <img
                          src={item.productId.images[0]}
                          alt={item.name}
                          className={style.itemImage}
                          onClick={() => handleItemClick(item)}
                        />
                      )}
                  </div>
                ))}
                
              </div>
              <div className={style.itemDetails}>
                  {selectedItem && (
                    <div className={style.selectedItemDetails}>
                      <h4>{selectedItem.productId.name}</h4>
                      <p>Color: {selectedItem.productId.color}</p>
                    </div>
                  )}
                 
                </div>
              <p>Delivery :Monday -FREE Standard Delivery</p>
              </div>
            </div>
            <hr />
          </div>

          <div className={style.orderSummary}>
            <h3>Order Summary</h3>
            <div className={style.ordercheck}>
              <p>Items</p>
              <p>₹{order.totalPrice}</p>
            </div>
            <div className={style.ordercheck}>
              <p>Delivery</p>
              <p>₹45.00</p>
            </div>
            <hr />
            <div className={style.ordercheck}>
              <h4>Order Total</h4>
              <h4> ₹{order.totalPrice + 45}</h4>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invoice;
