import moment from "moment";
import "moment/locale/pt-br";

function AlertCard({ foundAlert, camera, idx, showCameraName=false, nameCamera="" }) {

    //Formating date and time
    const datetime = moment(`${foundAlert.date} ${foundAlert.time}`, "DD/MM/YYYY HH:mm:ss");
    const formattedDate = datetime.format("D [de] MMMM [de] YYYY");
    const formattedTime = datetime.format("h:mm A");

    return (

        <div  className={`${foundAlert.type} alert d-flex flex-column flex-sm-row px-4 mb-3 mt-4`}>
            {/* Alert Image */}
            <div className="img-container">
                <img src={foundAlert.img} alt="imagem alerta" />
            </div>

            {/* Alert content */}
            <div className="d-flex flex-column ms-sm-4 info">
                {showCameraName ? 
                    <h4>{nameCamera}</h4>
                :
                    <h4>Alerta {camera.alerts.length - idx}</h4>
                }
                <p>Día: {formattedDate}</p>
                <p>Hora: {formattedTime}</p>
                <p>Tipo de alerta: {foundAlert.type}</p>
            </div>
        </div>

    );
};

export default AlertCard;
