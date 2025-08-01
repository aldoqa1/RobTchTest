import "./../assets/css/components/alertcard.css";
import "./../assets/css/views/alertsview.css";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";
import AlertCard from "../components/AlertCard";


function AlertsView() {

    const { data } = useContext(GlobalContext);

    return (

        <div className='alerts-view'>
            <h2>Alertas</h2>

            {data.alerts && data.alerts.map((alert) => {


                const foundCamera = data.cameras.find(cam =>{ 
                  if(cam.alerts.includes(alert.id)){
                    return cam;
                  }
                }
                );
                return <AlertCard  key={alert.id+"viewAlerts"} foundAlert={alert} showCameraName={true} nameCamera={foundCamera.name} />
            })}


        </div>

    );
}

export default AlertsView;
