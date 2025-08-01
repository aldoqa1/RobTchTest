import Swal from "sweetalert2";
import { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [data, setData] = useState([{}]);
  const [currentView, setCurrentView] = useState("DashboardView");
  const [lastView, setLastView] = useState("DashboardView");
  const [showModal, setShowModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [choosenId, setChoosenId] = useState(0);
  const [showToast, setShowToast] = useState(false);

  //it gets a copy of an object
  function getACopyOf(variable){
    return JSON.parse(JSON.stringify(variable));
  }

  //it saves the main variable
  function saveData(newData) {
    //saving the object in local storage
    localStorage.setItem('data', JSON.stringify(newData));
    setData(newData);
  }

  /* Alert */
  function alert(icon, title, text) {
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
    <GlobalContext.Provider value={{ data, setData, currentView, setCurrentView, lastView, setLastView, showModal, setShowModal, typeModal, setTypeModal, choosenId, setChoosenId, alert, showToast, setShowToast, saveData, getACopyOf }}>
      {children}
    </GlobalContext.Provider>
  );
};