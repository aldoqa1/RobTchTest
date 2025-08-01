import React, { createContext, useState } from 'react';
import Swal from "sweetalert2";
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) =>{

    const [data, setData] = useState ([{}]);
    const [currentView, setCurrentView] = useState ("DashboardView");
    const [lastView, setLastView] = useState ("DashboardView");
    const [showModal, setShowModal] = useState (false);
    const [typeModal, setTypeModal] = useState ("");
    const [choosenId, setChoosenId] = useState (0);
    const [showToast, setShowToast] = useState(false);
    
    
  /* Alert */
  function alert(icon, title, text){
    setTimeout(() => {
      Swal.fire({
        icon: icon,
        title: title,
        timer: 4000,
        text: text
      });      
    }, 0);

  }
  return (
    <GlobalContext.Provider value={{ data, setData, currentView, setCurrentView, lastView, setLastView, showModal, setShowModal, typeModal, setTypeModal, choosenId, setChoosenId, alert, showToast, setShowToast }}>
      {children}
    </GlobalContext.Provider>
  );
};