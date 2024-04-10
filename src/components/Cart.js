import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/Cart.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa";
import Select from "react-select";

const Cart = ({ cartItems, userId, isLoggedIn, handleLogout }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  console.log(cartProducts);
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const isMobile = window.innerWidth <= 768;
  const baseURL = "https://musicartbackend-a7k3.onrender.com";

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
    console.log(selectedQuantities);
  };

  useEffect(() => {
    let totalPrice = 0;
    cartProducts.forEach((item) => {
      const quantity = selectedQuantities[item.productId._id] || 1;
      totalPrice += item.productId.price * quantity;
    });
    setTotalPrice(totalPrice);
  }, [cartProducts, selectedQuantities]);

  const handlePlaceOrder = async () => {
    try {
      await axios.put(`${baseURL}/api/cart/updateCart/${userId}`, {
        cartItems: cartProducts.map((item) => ({
          productId: item.productId._id,
          quantity: selectedQuantities[item.productId._id] || 1,
        })),
      });
      setCartProducts([]);
      navigate("/checkout");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/cart/userCart/${userId}`
        );

        console.log("Fetched Cart Data:", response.data);
        setCartProducts(response.data.cart.cartItems);
        const initialQuantities = {};
        response.data.cart.cartItems.forEach((item) => {
          initialQuantities[item.productId._id] = item.quantity;
        });
        setSelectedQuantities(initialQuantities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartProducts();
  }, [userId]);

  useEffect(() => {
    setIsCartEmpty(cartProducts.length === 0);
  }, [cartProducts]);

  return (
    <div className={style.mainContainer}>
      
      <Navbar />
      <div className={style.cartContainer}>
        {isCartEmpty ? (
          <div className={style.emptyCartMessage}>
            <h3>Your Cart is empty</h3>
            <button onClick={handleBack} className={style.backButton}>
              Back to Products
            </button>
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className={style.BackLink}>
                <FaArrowLeft className={style.arrowIcon} onClick={handleBack} />
              </div>
            ) : (
              <div>
                <div className={style.BackLink}>
                  <button onClick={handleBack} className={style.backButton}>
                    Back to products
                  </button>
                </div>
              </div>
            )}

            <div className={style.cartHeader}>
              <HiOutlineShoppingBag className={style.bagIcon} />
              <h2> My Cart</h2>
            </div>
            {isMobile ? (
              <div className={style.cartMobileView}>
                {cartProducts &&
                  cartProducts.map((item) => (
                    <div key={item._id} className={style.cartItem}>
                      {item &&
                        item.productId.images &&
                        item.productId.images.length > 0 && (
                          <img
                            src={item.productId.images[0]}
                            alt={item.name}
                            className={style.itemImage}
                          />
                        )}

                      <div className={style.itemDetails}>
                        <div className={style.itemtitles}>
                          <h3>{item.productId.name}</h3>
                          <h3>₹{item.productId.price}</h3>
                          <p>Color: {item.productId.color}</p>
                          <p>{item.productId.availability}</p>
                          <p>Convenience Fee: ₹45</p>
                        </div>
                        <div className={style.totalprice}>
                          <h3>
                            {" "}
                            Total: ₹
                            {item.productId.price *
                              selectedQuantities[item.productId._id] ||
                              item.productId.price}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                <hr />
                <div className={style.totalAmount}>
                  <h3>Total Amount: ₹{totalPrice + 45}</h3>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className={style.placeOrderButton}
                >
                  PLACE ORDER
                </button>
              </div>
            ) : (
              <div className={style.cartDivison}>
                <div>
                  <hr />
                  <div className={style.cartItems}>
                    <hr />
                    {cartProducts &&
                      cartProducts.map((item) => (
                        <div key={item._id} className={style.cartItem}>
                          {item &&
                            item.productId.images &&
                            item.productId.images.length > 0 && (
                              <img
                                src={item.productId.images[0]}
                                alt={item.name}
                                className={style.itemImage}
                              />
                            )}

                          <div className={style.itemDetails}>
                            <div className={style.itemtitles}>
                              <h3>{item.productId.name}</h3>
                              <p>Color: {item.productId.color}</p>
                              <p>{item.productId.availability}</p>
                            </div>
                            <div className={style.itemprice}>
                              <h3>Price</h3>
                              <p>₹{item.productId.price}</p>
                            </div>
                            <div className={style.quantityControl}>
                              <h3>Quantity</h3>
                              <Select
                                options={[...Array(8).keys()].map((num) => ({
                                  value: num + 1,
                                  label: num + 1,
                                }))}
                                value={{
                                  value:
                                    selectedQuantities[item.productId._id] || 1,
                                  label:
                                    selectedQuantities[item.productId._id] || 1,
                                }}
                                onChange={(selectedOption) =>
                                  handleQuantityChange(
                                    item.productId._id,
                                    selectedOption.value
                                  )
                                }
                              />
                            </div>

                            <div className={style.totalprice}>
                              <h3>Total</h3>
                              <p>
                                {" "}
                                ₹
                                {item.productId.price *
                                  selectedQuantities[item.productId._id] ||
                                  item.productId.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <hr />
                  </div>
                  <hr />
                  <div className={style.totalitems}>
                    <p>{cartProducts.length} Items</p>
                    <p> ₹{totalPrice}</p>
                  </div>
                </div>
                <hr />
                <div className={style.cartSummary}>
                  <h3>PRICE DETAILS</h3>
                  <div className={style.priceDetails}>
                    <div className={style.prices}>
                      <p>Total MRP:</p>
                      <p> ₹{totalPrice}</p>
                    </div>
                    <div className={style.prices}>
                      <p>Discount on MRP:</p>
                      <p> ₹0</p>
                    </div>
                    <div className={style.prices}>
                      <p>Convenience Fee:</p>
                      <p>₹45</p>
                    </div>
                  </div>
                  <div className={style.totalAmount}>
                    <h3>Total Amount:</h3>
                    <h3>₹{totalPrice + 45}</h3>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className={style.placeOrderButton}
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
    </div>
  );
};

export default Cart;
