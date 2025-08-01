import "./../assets/css/components/alertcard.css";
import "./../assets/css/views/alertsview.css";
import { GlobalContext } from "../context/GlobalContext";
import { useContext, useEffect, useRef, useState } from "react";
import DropdownFilter from "../utilities/DropdownFilter";
import moment from "moment";

import AlertCard from "../components/AlertCard";


function AlertsView() {

  const { data, getACopyOf, alert, setCurrentView, setLastView,setChoosenId } = useContext(GlobalContext);

  const types = [
    {
      "id": 1,
      "name": "EPI"
    },
    {
      "id": 2,
      "name": "invasion"
    }
  ];

  //Variable to filter the cata
  const [filterData, setFilterData] = useState(data);
  const [choosenTypes, setChoosenTypes] = useState([1, 2]);
  const [choosenCameras, setChoosenCameras] = useState([]);
  const [activateDateFilter, setActivateDateFilter] = useState(false);

  //date filters
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  //it counts te quantity of alerts
  const count = useRef(0);

  //it validates both dates
  function validateDates() {

    const from = moment(fromDate, "YYYY-MM-DD");
    const to = moment(toDate, "YYYY-MM-DD");

    if (from.isAfter(to)) {
      alert("error", "Datas inválidas", "A data de início é maior do que a data final.");
      return;
    }

    const copyData = getACopyOf(data);
    count.current = 0;

    //it updates the alerts filter
    copyData.alerts = copyData.alerts.filter((al) => {

      const alertDate = moment(al.date, "DD/MM/YYYY");
      return alertDate.isSameOrAfter(from) && alertDate.isSameOrBefore(to);
    });

    copyData.cameras = copyData.cameras.filter((cam) => choosenCameras.includes(cam.id));
    setFilterData(copyData);
  }

  //it remove the current filters
  function removeFilters() {
    setFromDate(null);
    setToDate(null);
    setActivateDateFilter(false);
    setFilterData(data);
    count.current = 0;
  }

  function openAlert(id){
    setCurrentView("CameraViewAlert");
    setLastView("StatisticsView");
    setChoosenId(id);
  }

  //then choosencameras and choosentypes change
  useEffect(() => {

    //it gets the name of the choosen epis
    let nameTypes = choosenTypes.map(c => {
      if (c == 1) {
        return "EPI";
      } else {
        return "invasion"
      }
    });

    let copyData = getACopyOf(data);

    //it updates the cameras array
    copyData.cameras = copyData.cameras.filter((cam) => {
      if (choosenCameras.includes(cam.id)) {
        return cam;
      }
    });

    //it updates the alerts array
    copyData.alerts = copyData.alerts.filter((al) => {
      if (nameTypes.includes(al.type)) {
        return al;
      }
    })

    setFilterData(copyData);

    count.current = 0;

  }, [choosenCameras, choosenTypes])

  useEffect(() => {
    setChoosenCameras(data.cameras.map(cameras => cameras.id));
  }, []);


  return (

    <div className='alerts-view'>
      <h2 className="my-4">Alertas</h2>
      <p className="my-auto indicative fw-bold me-2 mb-4 mb-sm-0 ">Filtros: </p>

      {/* It shows the filters area */}
      <div className="d-flex align-items-md-center justify-content-between flex-column flex-md-row">

        <div className="dropdowns d-flex align-items-center">
          <DropdownFilter options={types} setChoosen={setChoosenTypes} choosenOptions={choosenTypes} title={"Tipo de alerta"} />
          <DropdownFilter options={data.cameras} setChoosen={setChoosenCameras} choosenOptions={choosenCameras} title={"Câmeras"} />
        </div>

        <div className="date d-flex align-items-md-center justify-content-between  mb-md-3 px-2 ms-0 ms-md-auto">
          
          {!activateDateFilter && <button onClick={() => setActivateDateFilter(true)} className="button openFilter mt-3 ms-0 ms-md-auto">Filtrar data</button>}
          
          {activateDateFilter && <div className="d-flex align-items-sm-center mt-3 mt-lg-0 flex-column">
            <span className="me-auto ms-2">Desde:</span>
            <input type="date" className="ms-2 me-3" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          }

          {activateDateFilter && <div className="d-flex align-items-sm-center mt-3 mt-lg-0  flex-column">
            <span className="me-auto ms-2">Ate:</span>
            <input className="ms-2" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>}

        </div>

        <div className="d-flex">
          {(fromDate && toDate) && <button className="cancel button ms-3 mt-3" onClick={() => removeFilters()} >Remover filtros</button>}
          {(fromDate && toDate) && <button className="apply button ms-3 mt-3" onClick={() => validateDates()} >Aplicar datas</button>}
        </div>

      </div>


      {/* filter alerts */}
      {filterData.alerts && filterData.alerts.map((alert) => {

        const foundCamera = filterData.cameras.find(cam => {
          if (cam.alerts.includes(alert.id)) {
            return cam;
          }
        }
        );
        
        if (foundCamera) {
          count.current = count.current + 1;
          return <div  key={alert.id + "viewAlerts"} className="outer" onClick={()=>{openAlert(alert.id)}} >  <AlertCard foundAlert={alert} showCameraName={true} nameCamera={foundCamera?.name} /></div>
        }
      })}

      {count.current == 0 && <div className="mt-4">Sem alertas</div>}


    </div>

  );
}

export default AlertsView;
