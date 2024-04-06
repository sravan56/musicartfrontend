import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ItemPage from "./components/ItemPage";
import Cart from "./components/Cart";
import HomeView from "./components/HomeView";
import Checkout from "./components/Checkout";
import axios from "axios";
import InvoiceList from "./components/InvoiceList";
import Invoice from "./components/Invoice";
import { useNavigate } from "react-router-dom";
import Sucesspage from "./components/Sucesspage";
import BottomNavbar from "./components/BottomNavbar";
import { useMediaQuery } from 'react-responsive';

function App() {
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,setUserName]=useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const baseURL='https://musicartbackend-a7k3.onrender.com';


  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const userName=localStorage.getItem('userName');
    if (authToken && storedUserId && userName) {
      setUserId(storedUserId);
      setUserName(userName);
      setIsLoggedIn(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      setIsLoggedIn(false);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem("userId");
    localStorage.removeItem('userName');
    localStorage.removeItem("authToken");

    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handleLogin = (user, token) => {
    setUserId(user.userId);
    console.log(userId);
    setUserName(user.name);
  
    localStorage.setItem("userId", user.userId);
    localStorage.setItem('userName',user.name);

    setIsLoggedIn(true);

    localStorage.setItem("authToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("login", isLoggedIn);
    navigate("/");
  };

  const addtoCart = (productId) => {
    const updatedCart = [...cartItems, productId];
    setCartItems(updatedCart);
    console.log(cartItems);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/cart/userCart/${userId}`);
        setCartItems(response.data.cart.cartItems);
        setCartItemCount(response.data.cart.cartItems.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, [userId]);
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              addtoCart={addtoCart}
              userId={userId}
              userName={userName}
              cartItemCount={cartItemCount}
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              isMobile={isMobile}
            />
          }
        ></Route>
        <Route
          path="/product/:itemId"
          element={<ItemPage addtoCart={addtoCart} userId={userId} isLoggedIn={isLoggedIn} />}
        ></Route>
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} userId={userId} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>}
        ></Route>
        <Route
          path="/checkout"
          element={<Checkout cartItems={cartItems} userId={userId} userName={userName} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
        ></Route>
        <Route path="/invoices" element={<InvoiceList userId={userId}  isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>}></Route>
        <Route path="/invoice/:orderId" element={<Invoice  isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>}></Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/view" element={<HomeView />}></Route>
        <Route path='/sucess' element={<Sucesspage/>}></Route>
      </Routes>
      {isMobile&&<BottomNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} cartItemCount={cartItemCount}/>}
    </div>
  );
}

export default App;
