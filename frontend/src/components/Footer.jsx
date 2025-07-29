import "./../assets/css/components/footer.css";
import { GlobalContext } from "./../context/GlobalContext";
import { useContext } from "react";

function Footer() {

    const { currentPage, setCurrentPage, setLastPage } = useContext(GlobalContext);

    function openAlerts(){
        setLastPage(currentPage);
        setCurrentPage("AlertsPage");
    }

    function openStatistics(){
        setLastPage(currentPage);
        setCurrentPage("StatisticsPage");
    }

    return (
        
        <footer className="d-flex align-items-center justify-content-between">

            <p>Projeto criado por <a href="https://aldoquevedo.tech/" target="_blank" rel="noopener noreferrer">Aldo Quevedo</a></p>
            
            <div className="d-flex align-items-center justify-content-between" >

                <button >EPIS</button>
                <button onClick={openAlerts}>Alertas</button>
                <button onClick={openStatistics}>Statistics</button>

            </div>

        </footer>

    );
};

export default Footer;
