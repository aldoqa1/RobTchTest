import Dropdown from 'react-bootstrap/Dropdown';
import "./../assets/css/components/footer.css";
import { GlobalContext } from "./../context/GlobalContext";
import { useContext, useState } from "react";

function Footer() {

    const { currentView, setCurrentView, setLastView, data, setData, alert } = useContext(GlobalContext);
    const [newEPI, setNewEPI] = useState("Adicionar");
    const [updateEPI, setUpdateEPI] = useState("");
    const [choosenEPI, setChoosenEPI] = useState("");

    function openAlerts(){
        setLastView(currentView);
        setCurrentView("AlertsView");
    }

    function openStatistics(){
        setLastView(currentView);
        setCurrentView("StatisticsView");
    }


    function deleteEPI(name){
      let copyData = JSON.parse(JSON.stringify(data));
        copyData.epis = copyData.epis.filter((epi)=>{
            if(name != epi){
                return epi;
            }
        });
        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));         
    }

    function activateUpdate(name){
        setChoosenEPI(name);
        setUpdateEPI(name);
    }

    function editEPI(){
        let copyData = JSON.parse(JSON.stringify(data));
        copyData.epis = copyData.epis.map((epi)=>{
            if(choosenEPI === epi){
                epi = updateEPI;
            }
            return epi;
        });
            //setting the new data into memory
            setData(copyData);
            //saving the object in local storage
            localStorage.setItem('data', JSON.stringify(copyData));  
            setChoosenEPI("");         
    }


    function addEPI(){
        
        if(newEPI.trim().length<1){
            alert("error", "Erro ao adicionar EPI", "O EPI está vazio");
        }else{
            let copyData = JSON.parse(JSON.stringify(data));
            copyData.epis.push(newEPI);
            //setting the new data into memory
            setData(copyData);
            //saving the object in local storage
            localStorage.setItem('data', JSON.stringify(copyData));      
            setNewEPI("Adicionar");
        }
    }

    return (
        
        <footer className="d-flex flex-column-reverse flex-sm-row  align-items-center justify-content-between">
            
            <div className='author'> <span>Projeto criado por <a href="https://aldoquevedo.tech/" className='link' target="_blank" rel="noopener noreferrer">Aldo Quevedo</a></span> </div>
            
            <div className="d-flex  align-items-center justify-content-between" >

               

                <Dropdown  onClick={(e)=>e.stopPropagation()}  drop="up" align="end" className="options-epis">
                    <Dropdown.Toggle >
                         <div className='d-flex epis button'>EPIS<div className="icon vector ms-1"></div></div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu onClick={(e)=>e.stopPropagation()}>
                        
                        <Dropdown.Item  onClick={(e)=>e.stopPropagation()} className="fw-bold d-flex align-items-center"> <input type="input text" placeholder='' onChange={(e)=>{setNewEPI(e.target.value)}} value={newEPI} /> <div onClick={addEPI} className='ms-auto icon add'></div></Dropdown.Item>

                        {data.epis && data.epis.map((epi, idx)=>{
                            return (
                            <Dropdown.Item key={idx+epi} onClick={(e)=>e.stopPropagation()} className=" d-flex align-items-center"> 
                            {choosenEPI == epi ? <div className="d-flex w-100">
                                <input type="input text" placeholder='' onChange={(e)=>{setUpdateEPI(e.target.value)}} value={updateEPI} /> <div onClick={editEPI} className='ms-auto icon edit'></div>                                 
                                </div>   
                           
                            :
                                <div className="d-flex w-100" >
                                    <p className='me-2 text'>{epi}</p> 
                                    <div onClick={()=>{activateUpdate(epi)}} className='ms-auto icon edit'></div>
                                    <div onClick={()=>{deleteEPI(epi)}} className="icon delete"></div>                                    
                                </div> 
                                                         
                            }


                             
                            </Dropdown.Item>)
                        })}

                    </Dropdown.Menu>
                </Dropdown>

                <button className='d-flex ms-3 ' onClick={openAlerts}>Alertas<div className="icon arrow ms-1"></div></button>
                <button className='d-flex ms-3' onClick={openStatistics}>Statistics<div className="icon arrow ms-1"></div></button>

            </div>

        </footer>

    );
};

export default Footer;
