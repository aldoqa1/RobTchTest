import "./../assets/css/components/header.css";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

function Header() {

    const {setLastView, setCurrentView, lastView, setShowModal, setTypeModal, currentView} = useContext(GlobalContext);

    //It renders the dashaboard
    function goHome(){
        setLastView(currentView);
        setCurrentView("DashboardView");
    }

    //it opens the modal to add a camera
    function addCamera(){
        setShowModal(true);
        setTypeModal("newCamera");
    }

    //it goes back to the last view
    function goBack(){
        setLastView(currentView);
        setCurrentView(lastView);
    }

    return (

        <header className="d-flex flex-column flex-sm-row align-items-center justify-content-between">

            <div className="d-flex align-items-center">
                {currentView !== "DashboardView" && <div className="icon back d-sm-flex d-none" onClick={goBack}></div>}
                <h1 className="cursor-pointer" onClick={goHome}>NeuroWatch</h1>
            </div>
            
            
            <div className="add-container">
                {currentView !== "DashboardView" && <div className="icon back d-flex d-sm-none" onClick={goBack}></div>}

                <button className="d-flex done" onClick={addCamera} > <div className="icon add me-2"></div> Adicionar câmera</button>
            </div>

        </header>

    );
};

export default Header;
