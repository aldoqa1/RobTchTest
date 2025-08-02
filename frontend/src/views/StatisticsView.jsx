import "./../assets/css/views/statisticsview.css";
import DropdownFilter from "../utilities/DropdownFilter";
import TopCamChart from "../utilities/TopCamChart";
import MapCam from "../utilities/MapCam";
import moment from "moment";
import { GlobalContext } from "../context/GlobalContext";
import { useContext, useEffect, useState } from "react";
import AlertTypePieChart from "../utilities/AlertTypePieChart";
import AlertsLineChart from "../utilities/AlertsLineChart";

function StatisticsView() {

    const { data, setCurrentView, setLastView, setChoosenId, getACopyOf, alert } = useContext(GlobalContext);

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

    //Variable to filter the data
    const [filterData, setFilterData] = useState(data);
    const [choosenTypes, setChoosenTypes] = useState([1, 2]);
    const [choosenCameras, setChoosenCameras] = useState([]);
    const [activateDateFilter, setActivateDateFilter] = useState(false);

    //date filters
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    //it validates both dates
    function validateDates() {

        const from = moment(fromDate, "YYYY-MM-DD");
        const to = moment(toDate, "YYYY-MM-DD");

        if (from.isAfter(to)) {
            alert("error", "Datas inválidas", "A data de início é maior do que a data final.");
            return;
        }

        const copyData = getACopyOf(data);

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
    }

    //then choosencameras and choosentypes change
    useEffect(() => {
        const nameTypes = choosenTypes.map((c) => (c === 1 ? "EPI" : "invasion"));

        const copyData = getACopyOf(data);

        copyData.cameras = copyData.cameras.filter((cam) =>
            choosenCameras.includes(cam.id)
        );

        //It checks if the alert type is choosen and also the alert was created by a camera that it's inside .cameras already filtered 
        copyData.alerts = copyData.alerts.filter((al) => nameTypes.includes(al.type) && copyData.cameras.some((cam) => cam.id === al.createdByCamId));

        setFilterData(copyData);
    }, [choosenCameras, choosenTypes]);

    useEffect(() => {
        setChoosenCameras(data.cameras.map(cameras => cameras.id));
    }, []);


    return (

        <div className='statistics'>

            <h2 className="mb-5 my-4">Estatisticas</h2>
            <p className="my-auto indicative fw-bold me-2 mb-4 mb-sm-0 ">Filtros: </p>

            <div className="filters d-flex flex-column flex-sm-row justify-content-between flex-column flex-md-row mb-3">

                <div className="dropdowns d-flex align-items-center">
                    <DropdownFilter options={types} setChoosen={setChoosenTypes} choosenOptions={choosenTypes} title={"Tipo de alerta"} />
                    <DropdownFilter options={data.cameras} setChoosen={setChoosenCameras} choosenOptions={choosenCameras} title={"Câmeras"} />
                </div>

                <div className=" d-flex align-items-md-center justify-content-between  mb-md-3 px-2 ms-0 ms-md-auto">


                    {!activateDateFilter && <button onClick={() => setActivateDateFilter(true)} className="button openFilter mt-3 ms-0 ms-md-auto">Filtrar data</button>}

                    {activateDateFilter && <div className="d-flex align-items-sm-center mt-3 mt-lg-0 flex-column date">
                        <span className="me-auto ms-2">Desde:</span>
                        <input type="date" className="ms-2 me-3" value={fromDate || ""} onChange={(e) => setFromDate(e.target.value)} />
                    </div>
                    }


                    {activateDateFilter && <div className="d-flex align-items-sm-center mt-3 mt-lg-0  flex-column date">
                        <span className="me-auto ms-2">Ate:</span>
                        <input className="ms-2" type="date" value={toDate || ""} onChange={(e) => setToDate(e.target.value)} />
                    </div>}


                </div>

                <div className="d-flex">
                    {(fromDate && toDate) && <button className="cancel button ms-3 mt-3" onClick={() => removeFilters()} >Remover filtros</button>}
                    {(fromDate && toDate) && <button className="apply button ms-3 mt-3" onClick={() => validateDates()} >Aplicar datas</button>}
                </div>

            </div>



            <MapCam data={filterData} setCurrentView={setCurrentView} setLastView={setLastView} setChoosenId={setChoosenId} />

            <TopCamChart filter={filterData} />

            <AlertTypePieChart filter={filterData} />

            <AlertsLineChart filter={filterData} />

        </div>

    );
}

export default StatisticsView;
