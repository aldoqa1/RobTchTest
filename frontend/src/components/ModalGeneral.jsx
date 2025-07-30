import "./../assets/css/components/modalgeneral.css";
import Modal from 'react-bootstrap/Modal';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../context/GlobalContext";

function ModalGeneral() {

    const { showModal, setShowModal, typeModal, alert, data, setData, choosenId } = useContext(GlobalContext);

    function handleClose() {
        setShowModal(false);
    }



    useEffect(()=>{

        if(typeModal === "updateCamera"){
            setCameraUpdate(data.cameras.find((e)=>e.id ===choosenId));
        }

    }, [showModal]);


    //============================== NEW CAMERA (start) ===========================//

    const [cameraNew, setCameraNew] = useState({ name: "", url: "", latitude: "", longitude: "" });

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
            status: 'online',
            longitude: cameraNew.longitude,
            latitude: cameraNew.latitude,
            url: cameraNew.url
        }

        let copyData = JSON.parse(JSON.stringify(data));
        copyData.cameras.push(camera);
        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

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

        let copyData = JSON.parse(JSON.stringify(data));

        copyData.cameras = copyData.cameras.map((cam)=>{
            if(cam.id == choosenId){
                cam = cameraUpdate;
            }

            return cam;
        })

        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

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

                        <div>
                            <label>Nome</label>
                            <input
                                type="text"
                                placeholder='Nome da câmera'
                                className='input'
                                value={cameraNew.name}
                                onChange={e => setCameraNew(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label>Url</label>
                            <input
                                type="text"
                                placeholder='Link da câmera'
                                className='input'
                                value={cameraNew.url}
                                onChange={e => setCameraNew(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>

                        <div>

                            <div>
                                <label>Latitude</label>
                                <input
                                    type="text"
                                    placeholder='Latitude da câmera'
                                    className='input'
                                    value={cameraNew.latitude}
                                    onChange={e => handleCoordsNew(e, "latitude")}
                                />
                            </div>

                            <div>
                                <label>Longitude</label>
                                <input
                                    type="text"
                                    placeholder='Longitude da câmera'
                                    className='input'
                                    value={cameraNew.longitude}
                                    onChange={e => handleCoordsNew(e, "longitude")}
                                />
                            </div>

                        </div>

                        <div>
                            <div className="button" onClick={handleClose}>Voltar</div>
                            <button onClick={(e) => { e.stopPropagation(); }}>Adicionar</button>

                        </div>
                    </form>

                </Modal.Body>

            }

            {/* Modal updateCamera */}
            {typeModal === "updateCamera" &&

                <Modal.Body onClick={handleClose}>

                    <form onClick={(e) => e.stopPropagation()} onSubmit={e => validateCameraUpdate(e)}>

                        <h2>Atualizar câmera</h2>

                        <div>
                            <label>Nome</label>
                            <input
                                type="text"
                                placeholder='Nome da câmera'
                                className='input'
                                value={cameraUpdate.name}
                                onChange={e => setCameraUpdate(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label>Url</label>
                            <input
                                type="text"
                                placeholder='Link da câmera'
                                className='input'
                                value={cameraUpdate.url}
                                onChange={e => setCameraUpdate(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>

                        <div>

                            <div>
                                <label>Latitude</label>
                                <input
                                    type="text"
                                    placeholder='Latitude da câmera'
                                    className='input'
                                    value={cameraUpdate.latitude}
                                    onChange={e => handleCoordsUpdate(e, "latitude")}
                                />
                            </div>

                            <div>
                                <label>Longitude</label>
                                <input
                                    type="text"
                                    placeholder='Longitude da câmera'
                                    className='input'
                                    value={cameraUpdate.longitude}
                                    onChange={e => handleCoordsUpdate(e, "longitude")}
                                />
                            </div>

                        </div>

                        <div>
                            <div className="button" onClick={handleClose}>Voltar</div>
                            <button onClick={(e) => { e.stopPropagation(); }}>Atualizar</button>

                        </div>
                    </form>

                </Modal.Body>

            }

        </Modal>

    );

}

export default ModalGeneral;

