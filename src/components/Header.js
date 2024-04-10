import React from "react";
import style from "../styles/Header.module.css";
import { Link,useNavigate} from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";

const Header = ({ isLoggedIn, handleLogout }) => {


  const navigate = useNavigate(); 

  const handleLogoutClick = () => {
    handleLogout(); 
    navigate("/login"); 
  };
  return (
    <div className={style.headerContainer}>
      <div className={style.header}>
        <h2>
        {" "}
        <FiPhoneCall /> 912121131313
      </h2>
      <h2>Get 50% off on selected items | Shop Now</h2>
      <div>
        {isLoggedIn ? (
          <h2>
            <div onClick={handleLogoutClick} className={style.linkstyle}>
              Logout
            </div>
          </h2>
        ) : (
          <h2>
            <Link to="/login" className={style.linkstyle}>
              Login
            </Link>
            |
            <Link to="/signup" className={style.linkstyle}>
              Signup
            </Link>
          </h2>
        )}
      </div>
      </div>
    </div>
  );
};

export default Header;
