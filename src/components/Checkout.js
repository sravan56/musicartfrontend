import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/Checkout.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {FaArrowLeft} from 'react-icons/fa';

const Checkout = ({ cartItems, userId,userName,isLoggedIn,handleLogout,placeOrder}) => {
  const [finalProducts, setFinalProducts] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedItem,setSelectedItem]=useState('');
  const navigate = useNavigate();


  const isMobile = window.innerWidth <= 768; 
  const baseURL='https://musicartbackend-a7k3.onrender.com';

 console.log(deliveryAddress);
  const handleBack = () => {
    navigate("/cart");
  };
 const handleItemClick=(item)=>{
  setSelectedItem(item);
 }
  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/cart/userCart/${userId}`
        );

        console.log("Fetched Cart Data:", response.data);
        setFinalProducts(response.data.cart.cartItems);
        const totalPrice = response.data.cart.cartItems.reduce(
          (total, item) => total + item.quantity * item.productId.price,
          0
        );
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartProducts();
  }, [userId]);

  const handlePlaceOrder = async () => {
    try {
   
      const response = await axios.post(
        `${baseURL}/api/order/placeOrder/${userId}`,
        {
          deliveryAddress,
          paymentMethod,
          cartItems:finalProducts,
          totalPrice,
          deliveryFee: 45, 
        }
      );

      console.log("Order placed:", response.data);
      setFinalProducts([]);
      placeOrder(0);
      console.log('Cart items cleared:', cartItems);
      navigate("/sucess"); 
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className={style.mainContainer}>
      
      <Navbar/>    
    <div className={style.checkoutContainer}>
      
      {isMobile?(
          <div className={style.BackLink}>
          <FaArrowLeft className={style.arrowIcon} onClick={handleBack}/>
          <h2 className={style.checkoutHeader}>Checkout</h2>
          </div>
        ):(
          <div className={style.BackLink}>
          <button onClick={handleBack} className={style.backButton}>
          Back to Cart
        </button>
        <h2 className={style.checkoutHeader}>Checkout</h2>
        </div>
        )}
      

      <div className={style.checkoutContent}>
       <div className={style.checkoutDivision}>
      <div className={style.checkoutSection}>
        <h3>1. Delivery address</h3>
        <div className={style.userAdress}>
        <p>{userName}</p>
        <textarea
          type="text"
          placeholder="Enter your delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className={style.addressInput}
        />
        </div>
      </div>
      <hr/>

      <div className={style.checkoutSection}>
        <h3>2. Payment method</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className={style.paymentSelect}
        >
          <option value="">Select payment method</option>
          <option value="COD">Pay on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
      </div>
      <hr/>

      <div className={style.checkoutSection}>
        <h3>3. Review items and delivery</h3>
        <div>
        <div className={style.cartItems}>
          {finalProducts.map((item) => (
            <div key={item._id} className={style.cartItem}>
              {item && item.productId.images && item.productId.images.length > 0 && (
                  <img
                    src={item.productId.images[0]}
                    alt={item.name}
                    className={style.itemImage}
                    onClick={()=>handleItemClick(item)}
                  />
                )}
            </div>
          ))}
        </div>
        {selectedItem && (
        <div className={style.selectedItemDetails}>
          <h4>{selectedItem.productId.name}</h4>
          <p>Color: {selectedItem.productId.color}</p>
          
        </div>
      )}
        <p>Estimated delivery:
          <br/>
           Monday - FREE Standard Delivery</p>
        </div>
      </div>
      <hr/>
     <div className={style.ordercheckout}>
      <button onClick={handlePlaceOrder} className={style.placeOrderButton}>
        Place your order
      </button>
      <div className={style.terms}>
        <h4>Order Total:   ₹{totalPrice}</h4>
      <span>By placing your order , you agree to Musicart privacy notice and conditions of use</span>
      <div/>
     </div>
      </div>
      
      </div>
      <div className={style.orderSummary}>
      {isMobile?(
        <>
        <h3>Order Summary</h3>
        <div className={style.orderPrice}>
          <div className={style.ordercheck}>
            <p>Items</p>
          <p>₹{totalPrice}</p>
          </div>
          <div className={style.ordercheck}>
            <p>Delivery</p>
          <p>₹45.00</p>
          </div>

       
        
        </div>
        <hr/>
        <div className={style.ordercheck}>
          <h4>Order Total</h4>
        <h4> ₹{(totalPrice + 45)}</h4>
        
        </div>
        <button onClick={handlePlaceOrder} className={style.placeOrderButton}>
        Place your order
      </button>
      </>
      ):(
        <>
        <button onClick={handlePlaceOrder} className={style.placeOrderButton}>
        Place your order
      </button>
      <span>By placing your order,you agree to Musicart privacy notice and conditions of use</span>
       <hr/>
        <h3>Order Summary</h3>
        <div className={style.orderPrice}>
          <div className={style.ordercheck}>
            <p>Items</p>
          <p>₹{totalPrice}</p>
          </div>
          <div className={style.ordercheck}>
            <p>Delivery</p>
          <p>₹45.00</p>
          </div>

       
        
        </div>
        <hr/>
        <div className={style.ordercheck}>
          <h4>Order Total</h4>
        <h4> ₹{(totalPrice + 45)}</h4>
        
        </div>
        </>
      )}
        
      </div>

      
       </div>
    </div>
   
    </div>
  );
};

export default Checkout;
