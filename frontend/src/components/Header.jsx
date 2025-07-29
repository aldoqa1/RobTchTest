import "./../assets/css/components/header.css";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

function Header() {

    const {setLastPage, setCurrentPage, lastPage, setShowModal, setTypeModal, currentPage} = useContext(GlobalContext);

    function goHome(){
        setLastPage(currentPage);
        setCurrentPage("DashboardPage");
    }

    function addCamera(){
        setShowModal(true);
        setTypeModal("AddCamera");
    }

    function goBack(){
        setLastPage(currentPage);
        setCurrentPage(lastPage);
    }

    

    return (

        <header className="d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center">
                {currentPage !== "DashboardPage" && <div className="icon back" onClick={goBack}></div>}
                <h1 className="cursor-pointer" onClick={goHome}>NeuroWatch</h1>
            </div>
            
            
            <div className="addContainer">
                {currentPage === "DashboardPage" && <button className="d-flex done" onClick={addCamera} > <div className="icon add me-2"></div> Adicionar câmera</button>}
            </div>

        </header>

    );
};

export default Header;
