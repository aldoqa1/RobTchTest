import moment from "moment";
import "moment/locale/pt-br";

function AlertCard({ foundAlert, camera, idx, showCameraName=false }) {

    const datetime = moment(`${foundAlert.date} ${foundAlert.time}`, "DD/MM/YYYY HH:mm:ss");
    const formattedDate = datetime.format("D [de] MMMM [de] YYYY");
    const formattedTime = datetime.format("h:mm A");


    return (

        <div key={foundAlert.id + "alertUnique" + camera.id} className={`${foundAlert.type} alert d-flex flex-column flex-sm-row px-4 mb-3`}>
            <div className="img-container">
                <img src={foundAlert.img} alt="imagem alerta" />
            </div>

            <div className="d-flex flex-column ms-sm-4 info">
                {showCameraName ? 
                    <h4>{showCameraName}</h4>
                :
                    <h4>Alerta {camera.alerts.length - idx}</h4>
                }
                <p>Dia: {formattedDate}</p>
                <p>Hora: {formattedTime}</p>
                <p>Tipo de alerta: {foundAlert.type}</p>
            </div>
        </div>

    );
};

export default AlertCard;
