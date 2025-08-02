import "./../assets/css/components/footer.css";
import Dropdown from 'react-bootstrap/Dropdown';
import { GlobalContext } from "./../context/GlobalContext";
import { useContext, useState } from "react";

function Footer() {

    const { currentView, setCurrentView, setLastView, data, alert, getACopyOf, saveData } = useContext(GlobalContext);

    //Epi dropdown variables
    const [newEPI, setNewEPI] = useState("Adicionar");
    const [updateEPI, setUpdateEPI] = useState("");
    const [choosenEPI, setChoosenEPI] = useState("");

    //it opens the alerts view
    function openAlerts() {
        setLastView(currentView);
        setCurrentView("AlertsView");
    }

    //it opens the statistics view
    function openStatistics() {
        setLastView(currentView);
        setCurrentView("StatisticsView");
    }

    //it deletes an global EPI
    function deleteEPI(id) {

        let copyData = getACopyOf(data);

        //it filter all the epis
        copyData.epis = copyData.epis.filter((epi) => {
            if (id != epi.id) {
                return epi;
            }
        });

        //it deletes the epi id from the cameras
        copyData.cameras = copyData.cameras.map((cam) => {

            cam.epis = cam.epis.filter((c) => {
                if (c != id) {
                    return c;
                }
            })

            return cam;
        });

        saveData(copyData);
    }

    //it activates the update input
    function activateUpdate(epi) {
        setChoosenEPI(epi.id);
        setUpdateEPI(epi.name);
    }

    //it updates an epi
    function editEPI() {

        let copyData = getACopyOf(data);

        //it updates the epis array
        copyData.epis = copyData.epis.map((epi) => {
            if (choosenEPI === epi.id) {
                epi =
                {
                    id: choosenEPI,
                    name: updateEPI
                };
            }
            return epi;
        });

        saveData(copyData);
        setChoosenEPI("");
    }

    //it adds an EPI to the array of epis
    function addEPI() {

        if (newEPI.trim().length < 1) {
            alert("error", "Erro ao adicionar EPI", "O EPI está vazio");
        } else {

            let copyData = getACopyOf(data);

            //it gets the last id epi
            const lastEpi = copyData.epis.at(-1);
            const lastId = lastEpi ? lastEpi.id : 0;
            copyData.epis.push({ id: lastId + 1, name: newEPI });

            saveData(copyData)
            setNewEPI("Adicionar");
        }
    }

    return (

        <footer className="d-flex flex-column-reverse flex-sm-row  align-items-center justify-content-between">

            <div className='author mt-sm-0 mt-4'> <span>Projeto criado por <a href="https://aldoquevedo.tech/" className='link' target="_blank" rel="noopener noreferrer">Aldo Quevedo</a></span> </div>

            <div className="d-flex menu align-items-center justify-content-between" >
                
                {/* EPIS dropdown */}
                <Dropdown onClick={(e) => e.stopPropagation()} drop="up" align="end" className="options-epis">

                    <Dropdown.Toggle >
                        <div className='d-flex epis button'>EPIS<div className="icon vector ms-1"></div></div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu onClick={(e) => e.stopPropagation()}>

                        <Dropdown.Item onClick={(e) => e.stopPropagation()} className="fw-bold d-flex align-items-center"> <input type="input text" placeholder='' onChange={(e) => { setNewEPI(e.target.value) }} value={newEPI} /> <div onClick={addEPI} className='ms-auto icon add'></div></Dropdown.Item>

                        {data.epis && data.epis.map((epi) => {
                            return (
                                <Dropdown.Item key={epi.id} onClick={(e) => e.stopPropagation()} className=" d-flex align-items-center">
                                    {/* Conditional rendering for whether it is updating or not */}
                                    {choosenEPI == epi.id ? <div className="d-flex w-100">
                                        <input type="input text" placeholder='' onChange={(e) => { setUpdateEPI(e.target.value) }} value={updateEPI} /> <div onClick={editEPI} className='ms-auto icon edit'></div>
                                    </div>
                                        :
                                        <div className="d-flex w-100" >
                                            <p className='me-2 text'>{epi.name}</p>
                                            <div onClick={() => { activateUpdate(epi) }} className='ms-auto icon edit'></div>
                                            <div onClick={() => { deleteEPI(epi.id) }} className="icon delete"></div>
                                        </div>

                                    }
                                </Dropdown.Item>
                            )
                        })}

                    </Dropdown.Menu>
                </Dropdown>

                {/* Buttons to open Alertas and Statisticas */}
                <button className='d-flex ms-3 ' onClick={openAlerts}>Alertas<div className="icon arrow ms-1"></div></button>
                <button className='d-flex ms-3' onClick={openStatistics}>Estatisticas<div className="icon arrow ms-1"></div></button>

            </div>

        </footer>

    );
};

export default Footer;
