import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import image5 from "../images/image_5.png";
import style from "../styles/Home.module.css";
import axios from "axios";
import GridItem from "./GridItem";
import ListItem from "./ListItem";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import FilterandSort from "./FilterandSort";
import Feedback from "./Feedback";
import { VscFeedback } from "react-icons/vsc";


const Home = ({
  productItem,
  addtoCart,
  userId,
  userName,
  cartItemCount,
  isLoggedIn,
  handleLogout,
  isMobile
}) => {
  const [productItems, setProductItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [selectedHeadphoneType, setSelectedHeadphoneType] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const [sortCriteria, setSortCriteria] = useState("featured");
  const [sortedProducts, setSortedProducts] = useState([]);

  const [isGridView, setIsGridView] = useState(true);

  const [isModalOpen,setIsModalOpen]=useState(false);

  const openModal=()=>{
    setIsModalOpen(true);
  }
  const closeModal=()=>{
    setIsModalOpen(false);
  }

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const baseURL='https://musicartbackend-a7k3.onrender.com';

  const handleDropdownChange = (event, setStateFunc) => {
    console.log("Dropdown changed:", event.target.value);
    setStateFunc(event.target.value);
  };

  const handleSearch = async (searchText) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/items/searchproduct?searchQuery=${searchText}`
      );
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const filterItems = async () => {
      try {
        const resposne = await axios.get(
          `${baseURL}/api/items/filter?headphoneType=${selectedHeadphoneType}&company=${selectedCompany}&color=${selectedColor}&price=${selectedPrice}`
        );
        setFilteredItems(resposne.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      selectedHeadphoneType ||
      selectedCompany ||
      selectedColor ||
      selectedPrice
    ) {
      filterItems();
    }
  }, [selectedHeadphoneType, selectedColor, selectedCompany, selectedPrice]);

  useEffect(() => {
    const sortProducts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/items/sort?sortCriteria=${sortCriteria}`
        );
        setSortedProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    sortProducts();
  }, [sortCriteria]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/items/allproducts`
        );
        setProductItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [productItems]);

  return (
    <div className={style.HomeContainer}>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className={style.mainContainer}>
        
        {isMobile?(
          <>
          <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
          <div className={style.Banner}>
          <div className={style.BannerContent}>
          <h2>
            Grab upto 50% off on <br />
            Selected headphones
          </h2>
          <button>Buy Now</button>
          </div>
          <img src={image5} alt="HeadsetGirl" />
        </div>
        </>
        ):(
          <>
          <Navbar
          isLoggedIn={isLoggedIn}
          userName={userName}
          cartItemCount={cartItemCount}
          handleLogout={handleLogout}
        />
          <div className={style.Banner}>
          <h2>
            Grab upto 50% off on <br />
            Selected headphones
          </h2>
          <img src={image5} alt="HeadsetGirl" />
        </div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        </>
        )}
        
        <FilterandSort
          selectedHeadphoneType={selectedHeadphoneType}
          setSelectedHeadphoneType={setSelectedHeadphoneType}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
          toggleView={toggleView}
          handleDropdownChange={handleDropdownChange}
        />

        <div className={isGridView ? style.GridContainer : style.listContainer}>
          {searchQuery.trim() === "" &&
          selectedHeadphoneType === "" &&
          selectedCompany === "" &&
          selectedColor === "" &&
          selectedPrice === "" &&
          sortCriteria === "featured" ? (
            <>
              {productItems.map((item) => (
                <div key={item.id}>
                  {isGridView ? (
                    <GridItem
                      item={item}
                      addtoCart={addtoCart}
                      userId={userId}
                    />
                  ) : (
                    <ListItem
                      item={item}
                      addtoCart={addtoCart}
                      userId={userId}
                    />
                  )}
                </div>
              ))}
            </>
          ) : searchQuery.trim() === "" ? (
            <>
              {selectedHeadphoneType === "" &&
              selectedCompany === "" &&
              selectedColor === "" &&
              selectedPrice === "" ? (
                <>
                  {sortedProducts.map((item) => (
                    <div key={item.id}>
                      {isGridView ? (
                        <GridItem
                          item={item}
                          addtoCart={addtoCart}
                          userId={userId}
                        />
                      ) : (
                        <ListItem
                          item={item}
                          addtoCart={addtoCart}
                          userId={userId}
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {filteredItems.map((item) => (
                    <div key={item.id}>
                      {isGridView ? (
                        <GridItem
                          item={item}
                          addtoCart={addtoCart}
                          userId={userId}
                        />
                      ) : (
                        <ListItem
                          item={item}
                          addtoCart={addtoCart}
                          userId={userId}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {searchResults.map((item) => (
                <div key={item.id}>
                  {isGridView ? (
                    <GridItem
                      item={item}
                      addtoCart={addtoCart}
                      userId={userId}
                    />
                  ) : (
                    <ListItem
                      item={item}
                      addtoCart={addtoCart}
                      userId={userId}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        {isLoggedIn?(
          <>
          <VscFeedback onClick={openModal} className={style.feedbackIcon}/>
          <Feedback  isOpen={isModalOpen} onClose={closeModal}/>
        </>
        ):('')}
        
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;
