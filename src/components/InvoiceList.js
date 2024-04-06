import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from '../styles/InvoiceList.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa';
import Icon from '@mdi/react';
import { mdiInvoiceEdit } from '@mdi/js';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';


const InvoiceList = ({userId,isLoggedIn,handleLogout}) => {
  const [invoices, setInvoices] = useState([]);

  const isMobile = window.innerWidth <= 768; 
  const baseURL='https://musicartbackend-a7k3.onrender.com';

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/order/allorders/${userId}`);
        setInvoices(response.data.orders);
        console.log(response.data.orders);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, [userId]);

  return (
    <div className={style.mainContainer}>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
      <Navbar/>
    <div className={style.invoiceListContainer}>
      
     
      <div>
     {isMobile?(
          <div className={style.BackLink}>
          <div className={style.backIcon}>
          <FaArrowLeft className={style.arrowIcon} onClick={handleBack}/>
          </div>
          <h2 className={style.invoiceListHeader}><Icon path={mdiInvoiceEdit} size={1}/>My Invoices</h2>
          </div>
        ):(
          <div className={style.BackLink}>
          <button onClick={handleBack} className={style.backButton}>
          Back to Home
        </button>
<h2 className={style.invoiceListHeader}><Icon path={mdiInvoiceEdit} size={1}/>My Invoices</h2>
        </div>        
        )}
     
      </div>
      <div className={style.invoiceList}>
        {invoices && invoices.length>0 && invoices.map((invoice) => (
          <div key={invoice._id}>
            <div key={invoice._id} className={style.invoiceCard}>
            <>
           <div className={style.invoiceDetails}>
           <Icon path={mdiInvoiceEdit} size={2} color="grey"></Icon>
            <div className={style.invoicedetails}>
            <p>{invoice.userId.name}</p>
            <p>{invoice.deliveryAddress}</p>
            </div>
           </div>
            <Link to={`/invoice/${invoice._id}`} className={style.viewInvoiceButton}>
              View Invoice
            </Link>
            
            </>
          </div>
            <hr/>
          </div>

          
        ))}
      </div>
     
    </div>
    <Footer/>
    </div>
  );
};

export default InvoiceList;