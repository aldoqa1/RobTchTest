import "./../assets/css/views/statisticsview.css";
import DropdownFilter from "../utilities/DropdownFilter";
import MapF from "../utilities/MapF";
import { GlobalContext } from "../context/GlobalContext";
import { useContext, useEffect, useState } from "react";
import moment from "moment";

function StatisticsView() {

    const { data, setCurrentView, setLastView, setChoosenId, getACopyOf, alert } = useContext(GlobalContext);

    const [filterData, setFilterData] = useState(data);
    const [choosenTypes, setChoosenTypes] = useState([1, 2]);

    const [activateDateFilter, setActivateDateFilter] = useState(false);

    const [choosenCameras, setChoosenCameras] = useState([]);


    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

  function validateDates() {
    const from = moment(fromDate, "YYYY-MM-DD"); 
    const to = moment(toDate, "YYYY-MM-DD");

    if (from.isAfter(to)) {
      alert("Erro", "Datas inválidas", "A data de início é maior do que a data final.");
      return;
    }

    const copyData = getACopyOf(data);

  
    copyData.alerts = copyData.alerts.filter((al) => {
      const alertDate = moment(al.date, "DD/MM/YYYY"); 
      return alertDate.isSameOrAfter(from) && alertDate.isSameOrBefore(to);
    });


    copyData.cameras = copyData.cameras.filter((cam) => choosenCameras.includes(cam.id));

    setFilterData(copyData);
  }


    useEffect(() => {

        let copyData = getACopyOf(data);

        copyData.cameras = copyData.cameras.filter((cam) => {
            if (choosenCameras.includes(cam.id)) {
                return cam;
            }
        });

        copyData.alerts = copyData.alerts.filter((al) => {
            if (choosenTypes.includes(types[al.id])) {
                return al;
            }
        })

        setFilterData(copyData);


    }, [choosenCameras, choosenTypes])



    useEffect(() => {
        setChoosenCameras(data.cameras.map(cameras => cameras.id));
    }, []);



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


    return (

        <div className='statistics'>

            <h2 className="mb-5 my-4">Statisticas</h2>

            <div className="filters d-flex flex-column flex-sm-row justify-content between mb-3">

                <div className="dropdowns d-flex align-items-center">
                    <p className="my-auto indicative fw-bold me-4">Filtros: </p>
                    <DropdownFilter options={types} setChoosen={setChoosenTypes} choosenOptions={choosenTypes} title={"Tipo de alerta"} />
                    <DropdownFilter options={data.cameras} setChoosen={setChoosenCameras} choosenOptions={choosenCameras} title={"Câmeras"} />

                </div>

                <div className="date d-flex align-items-center ms-auto">
                    {!activateDateFilter && <button onClick={() => setActivateDateFilter(true)} className="button">Filtrar data</button>}
                    {activateDateFilter && <span className="me-1">Desde:</span>}
                    {activateDateFilter && <input type="date" className="ms-2 me-3" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />}
                    {activateDateFilter && <span className="me-1">Ate:</span>}
                    {activateDateFilter && <input className="ms-2" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />}
                    {(fromDate && toDate) && <button className="apply button ms-3" onClick={() => validateDates()} >Aplicar datas</button>}
                </div>
            </div>



            <MapF data={filterData} setCurrentView={setCurrentView} setLastView={setLastView} setChoosenId={setChoosenId} />

        </div>

    );
}

export default StatisticsView;
