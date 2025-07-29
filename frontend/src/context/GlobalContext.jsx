import React, { createContext, useState } from 'react';
import Swal from "sweetalert2";
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) =>{
    const [data, setData] = useState ([{}]);
    const [currentPage, setCurrentPage] = useState ("DashboardPage");
    const [lastPage, setLastPage] = useState ("DashboardPage");
    const [showModal, setShowModal] = useState (false);
    const [typeModal, setTypeModal] = useState ("");
    const [choosenId, setChoosenId] = useState (0);
    
  /* Alert */
  function alert(icon, title, text){
    setTimeout(() => {
      Swal.fire({
        icon: icon,
        title: title,
        timer: 4000,
        text: text,
      });      
    }, 0);

  }
  return (
    <GlobalContext.Provider value={{ data, setData, currentPage, setCurrentPage, lastPage, setLastPage, showModal, setShowModal, typeModal, setTypeModal, choosenId, setChoosenId, alert }}>
      {children}
    </GlobalContext.Provider>
  );
};