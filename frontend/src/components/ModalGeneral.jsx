import "./../assets/css/components/modalgeneral.css";
import Modal from 'react-bootstrap/Modal';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../context/GlobalContext";

function ModalGeneral() {

    const { showModal, setShowModal, typeModal, alert, data, setData, choosenId, getACopyOf, saveData } = useContext(GlobalContext);


    
    //when the modal changes and it's equal to update camera it searches for the camera 
    useEffect(()=>{

        if(typeModal === "updateCamera"){
            setCameraUpdate(data.cameras.find((e)=>e.id ===choosenId));
        }

    }, [showModal]);

    //it closes the modal
    function handleClose() {
        setShowModal(false);
    }




    //============================== NEW CAMERA (start) ===========================//

    const [cameraNew, setCameraNew] = useState({ name: "", url: "", latitude: "", longitude: "" });

    //it cleans the camera new inputs
    function cleanCameraNew(){
        setCameraNew({ name: "", url: "", latitude: "", longitude: "" });
    }

    //it validates the inputs
    function validateCameraNew(e) {
        e.preventDefault();
        if (cameraNew.name.length < 1 || cameraNew.url.length < 1 || cameraNew.latitude.length < 11 || cameraNew.longitude.length < 11) {
            alert("error", "Erro ao criar câmera", "Alguns dados estão vazios ou incompletos");
        }else{
            createCamera();
        }
    }

    //it creates a new camera
    function createCamera() {

        //it gets the last id camera
        const lastCamera = data.cameras.at(-1);
        const lastId = lastCamera ? lastCamera.id : 0;

        const camera = {
            id: lastId+1,
            name: cameraNew.name,
            status: 'offline',
            longitude: cameraNew.longitude,
            latitude: cameraNew.latitude,
            url: cameraNew.url,
            epis: [],
            alerts: [],
            pendingAlerts: false,
            areas: []
        }

        alert("success", "Câmera criada", "A câmera foi criada com sucesso");

        let copyData = getACopyOf(data);

        //it adds a camera the cameras array
        copyData.cameras.push(camera);
       
        saveData(copyData);

        cleanCameraNew();
        setShowModal(false);
    }

    //It formats the text to DMS
    function formatDMS(text) {
        //It replaces all the characters in the text that are different than 0-9
        text = text.toUpperCase().replace(/[^0-9]/g, "");

        let degrees = text.slice(0, 3);
        let minutes = text.slice(3, 5);
        let seconds = text.slice(5, 7);

        let result = "";

        if (degrees) result += degrees;
        if (minutes) result += `°${minutes}`;
        if (seconds) result += `'${seconds}`;
        if (text.length == 7) result += `"`;

        return result;
    }

    //It handles the text formaat
    function handleCoordsNew(e, type) {

        //raw text
        const target = e.target.value;

        //if the key is to delete, it just deletes the text if it's bigger than 9 characters
        if (e.nativeEvent.inputType == "deleteContentBackward" && target.length > 9) {
            setCameraNew(prev => ({ ...prev, [type]: target.value }));
            return;
        }

        //In the case the lenght is bigger than 9, it means we already finished keying digits,
        if (target.length > 9) {
            
            //in the case the lenght is longer than 11, we dont render the text
            if (target.length > 11) {
                let auxTarget = target;
                auxTarget = auxTarget.split("");
                auxTarget[auxTarget.length - 1] = '';
                auxTarget = auxTarget.join("");
                setCameraNew(prev => ({ ...prev, [type]: auxTarget }));
                return;
            }

            //it gests the last character, making it uppercase and checking if its N E W S
            const lastCharacter = target[target.length - 1].toUpperCase();
            let auxTarget = target;
            auxTarget = auxTarget.split("");
        
            //here, it distinguises between longitude and latitude, in order to set the W/E or N/S
            if (type == "longitude" && (lastCharacter == 'W' || lastCharacter == 'E')) {
                auxTarget[auxTarget.length - 1] = auxTarget[auxTarget.length - 1].toUpperCase();
            }else if(type == "latitude" && (lastCharacter == 'N' || lastCharacter == 'S')){
                auxTarget[auxTarget.length - 1] = auxTarget[auxTarget.length - 1].toUpperCase();
            }else{
                auxTarget[auxTarget.length - 1] = '';
            }

            auxTarget = auxTarget.join("");
            setCameraNew(prev => ({ ...prev, [type]: auxTarget }));

            return;
        }

        //In the case the lenght is smaller than 9 we use a fuction to format to DMS, by avoiding using characters and adding special characters
        const input = e.target.value;
        const formatted = formatDMS(input);
        setCameraNew(prev => ({ ...prev, [type]: formatted }));
    }

    //============================== NEW CAMERA (end) =============================//






    
    //============================== UPDATE CAMERA (start) ===========================//

    const [cameraUpdate, setCameraUpdate] = useState({ name: "", url: "", latitude: "", longitude: "" });

    //it cleans the camera update inputs
    function cleanCameraUpdate(){
        setCameraUpdate({ name: "", url: "", latitude: "", longitude: "" });
    }

    //it validates the inputs
    function validateCameraUpdate(e) {
        e.preventDefault();
        if (cameraUpdate.name.length < 1 || cameraUpdate.url.length < 1 || cameraUpdate.latitude.length < 11 || cameraUpdate.longitude.length < 11) {
            alert("error", "Erro ao atuializar câmera", "Alguns dados estão vazios ou incompletos");
        }else{
            updateCamera();
        }
    }

    //it updates a camera
    function updateCamera() {

        let copyData = getACopyOf(data);

        //it updates the cameras array
        copyData.cameras = copyData.cameras.map((cam)=>{
            if(cam.id == choosenId){
                cam = cameraUpdate;
            }

            return cam;
        })

        saveData(copyData);

        cleanCameraUpdate();
        setShowModal(false);
    }

    //It handles the text formaat
    function handleCoordsUpdate(e, type) {

        //raw text
        const target = e.target.value;

        //if the key is to delete, it just deletes the text if it's bigger than 9 characters
        if (e.nativeEvent.inputType == "deleteContentBackward" && target.length > 0) {
            setCameraUpdate(prev => ({ ...prev, [type]: target.value }));
            return;
        }

        //In the case the lenght is bigger than 9, it means we already finished keying digits,
        if (target.length > 9) {
            
            //in the case the lenght is longer than 11, we dont render the text
            if (target.length > 11) {
                let auxTarget = target;
                auxTarget = auxTarget.split("");
                auxTarget[auxTarget.length - 1] = '';
                auxTarget = auxTarget.join("");
                setCameraUpdate(prev => ({ ...prev, [type]: auxTarget }));
                return;
            }

            //it gests the last character, making it uppercase and checking if its N E W S
            const lastCharacter = target[target.length - 1].toUpperCase();
            let auxTarget = target;
            auxTarget = auxTarget.split("");
        
            //here, it distinguises between longitude and latitude, in order to set the W/E or N/S
            if (type == "longitude" && (lastCharacter == 'W' || lastCharacter == 'E')) {
                auxTarget[auxTarget.length - 1] = auxTarget[auxTarget.length - 1].toUpperCase();
            }else if(type == "latitude" && (lastCharacter == 'N' || lastCharacter == 'S')){
                auxTarget[auxTarget.length - 1] = auxTarget[auxTarget.length - 1].toUpperCase();
            }else{
                auxTarget[auxTarget.length - 1] = '';
            }

            auxTarget = auxTarget.join("");
            setCameraUpdate(prev => ({ ...prev, [type]: auxTarget }));

            return;
        }

        //In the case the lenght is smaller than 9 we use a fuction to format to DMS, by avoiding using characters and adding special characters
        const input = e.target.value;
        const formatted = formatDMS(input);
        setCameraUpdate(prev => ({ ...prev, [type]: formatted }));
    }

    //============================== UPDATE CAMERA (end) =============================//






    return (

        <Modal className='modal-general' show={showModal} onHide={handleClose} >

            {/* Modal newCamera */}
            {typeModal === "newCamera" &&

                <Modal.Body onClick={handleClose}>

                    <form onClick={(e) => e.stopPropagation()} onSubmit={e => validateCameraNew(e)}>

                        <h2>Adicionar câmera</h2>

                        <div className="d-flex flex-column  ">
                            <label className="adjust">Nome:</label>
                            <input 
                                type="text"
                                placeholder='Nome da câmera'
                                className='input w-100'
                                value={cameraNew.name}
                                onChange={e => setCameraNew(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="d-flex mt-3 flex-column ">
                            <label className="adjust">Url:</label>
                            <input
                                type="text"
                                placeholder='Link da câmera'
                                className='input w-100'
                                value={cameraNew.url}
                                onChange={e => setCameraNew(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>

                        <div className="d-flex mt-3 flex-column flex-sm-row"> 

                            <div className="me-0 me-sm-3">
                                <label>Latitude:</label>
                                <input
                                    type="text"
                                    placeholder='Latitude da câmera'
                                    className='input w-100'
                                    value={cameraNew.latitude}
                                    onChange={e => handleCoordsNew(e, "latitude")}
                                />
                            </div>

                            <div className="mt-3 mt-sm-0">
                                <label>Longitude:</label>
                                <input
                                    type="text"
                                    placeholder='Longitude da câmera'
                                    className='input w-100'
                                    value={cameraNew.longitude}
                                    onChange={e => handleCoordsNew(e, "longitude")}
                                />
                            </div>

                        </div>

                        <div className="d-flex w-100 align-items-center mt-4 justify-content-between">
                            <div className="button close d-flex align-items-center" onClick={handleClose}><div className="icon me-1 back d-inline-flex"></div>Voltar</div>
                            <button className="add d-flex align-items-center" onClick={(e) => { e.stopPropagation(); }}>Adicionar <div className="icon ms-1 add d-inline-flex"></div></button>

                        </div>
                    </form>

                </Modal.Body>

            }

            {/* Modal updateCamera */}
            {typeModal === "updateCamera" &&

                <Modal.Body onClick={handleClose}>

                    <form onClick={(e) => e.stopPropagation()} onSubmit={e => validateCameraUpdate(e)}>

                        <h2>Atualizar câmera</h2>

                        <div className="d-flex mt-3 flex-column "> 
                            <label>Nome:</label>
                            <input
                                type="text"
                                placeholder='Nome da câmera'
                                className='input w-100'
                                value={cameraUpdate.name}
                                onChange={e => setCameraUpdate(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="d-flex mt-3 flex-column ">
                            <label>Url:</label>
                            <input
                                type="text"
                                placeholder='Link da câmera'
                                className='input w-100'
                                value={cameraUpdate.url}
                                onChange={e => setCameraUpdate(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>

                        <div className="d-flex mt-3 flex-column flex-sm-row">

                            <div className="me-0 me-sm-3">
                                <label>Latitude:</label>
                                <input
                                    type="text"
                                    placeholder='Latitude da câmera'
                                    className='input w-100'
                                    value={cameraUpdate.latitude}
                                    onChange={e => handleCoordsUpdate(e, "latitude")}
                                />
                            </div>

                            <div className="mt-3 mt-sm-0">
                                <label>Longitude:</label>
                                <input
                                    type="text"
                                    placeholder='Longitude da câmera'
                                    className='input w-100'
                                    value={cameraUpdate.longitude}
                                    onChange={e => handleCoordsUpdate(e, "longitude")}
                                />
                            </div>

                        </div>

                        <div className="d-flex w-100 align-items-center mt-4 justify-content-between">
                            <div className="button close d-flex align-items-center" onClick={handleClose}><div className="icon me-1 back d-inline-flex"></div>Voltar</div>
                            <button className="add d-flex align-items-center" onClick={(e) => { e.stopPropagation(); }}>Atualizar <div className="icon ms-1 add d-inline-flex"></div></button>

                        </div>
                    </form>

                </Modal.Body>

            }

        </Modal>

    );

}

export default ModalGeneral;

