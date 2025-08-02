import "./../assets/css/components/cameracard.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from "sweetalert2";
import moment from "moment";
import Hls from "hls.js";
import { GlobalContext } from "./../context/GlobalContext";
import { useRef, useEffect, useContext } from "react";

function CameraCard({ camera }) {

    const { data, setCurrentView, setLastView, currentView, setChoosenId, alert, setTypeModal, setShowModal, saveData, getACopyOf } = useContext(GlobalContext);

    //Ref variables
    const pendingAlertsRef = useRef("")
    const canvasBoxRef = useRef();
    const statusRef = useRef("");
    const videoRef = useRef();
    const dataRef = useRef(data);

    //Variables for the bounding boxes
    const xInitialObject = useRef(0);
    const yInitialObject = useRef(0);
    const xWidthObject = useRef(0);
    const yWidthObject = useRef(0);

    //it gets the current data value, status and it checks if the current camera is pending of alerts 
    useEffect(() => {
        dataRef.current = data;
        statusRef.current = data.cameras.find(c => c.id == camera.id).status;
        pendingAlertsRef.current = data.cameras.find(c => c.id == camera.id).pendingAlerts;
    }, [data]);

    //whenever the url of the camera or the status changes it'll try set the video
    useEffect(() => {
 
        const src = camera.url;
        const video = videoRef.current;
       
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            //when it detects its playing the video, it turns on the state
            function handlePlaying() {
                turningCamera("online");
            };

            video.addEventListener("playing", handlePlaying);

            //This function clean the component by destroying the hls and deattaching the event listener (to free memory)
            return function cleanComponent() {
                hls.destroy();
                video.removeEventListener("playing", handlePlaying);
            };

        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.play();
        }

    }, [camera.url, statusRef.current]);

    //this interval is just runned once in the beginning
    useEffect(() => {

        //random interval
        const interval = setInterval(() => {

            //it just draws if the status is online
            if (statusRef.current == "online") {
                
                //variables to set the drawing on the canvas
                const canvasBox = canvasBoxRef.current;
                const contextBox = canvasBox.getContext("2d");
                const container = canvasBox.parentElement;
                const w = canvasBox.width = container.clientWidth;
                const h = canvasBox.height = container.clientHeight;
                contextBox.lineWidth = 2;
                contextBox.strokeStyle = "yellow";
                xInitialObject.current = Math.random() * 0.84 * w + 1;
                yInitialObject.current = Math.random() * 0.59 * h + 1;
                xWidthObject.current = w * .15;
                yWidthObject.current = h * .4;
                
                //it sets the border when a alert is created
                const innerContainer = videoRef.current.parentElement.parentElement;
                innerContainer.classList.add("border-alert");      
                
                //it draws the bounding object
                contextBox.strokeRect(xInitialObject.current, yInitialObject.current, xWidthObject.current, yWidthObject.current);
                
                //it creates the alert
                createAlert();

                //it delays the clean of the canvas and finally removes the border 
                setTimeout(() => {
                    contextBox.clearRect(0, 0, canvasBox.width, canvasBox.height);
                    innerContainer.classList.remove("border-alert");
                }, 10000);
            }
        }, Math.random() * 100000 + 10000);

        //it clean the interval when the components is unmonted
        return function cleanComponent() {
            clearInterval(interval);
        };

    }, []);

    //it changes the camera status
    function turningCamera(status) {

        let copyData = getACopyOf(data);

        //it update the cameras array
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id == camera.id) {
                cam.status = status;
            }
            return cam;
        });

        saveData(copyData)
    }

    //it opnes the camera info
    function openCamera() {

        //it sets the camera view and the necessary data
        setCurrentView("CameraView");
        setLastView(currentView);
        setChoosenId(camera.id);
        
        let copyData = getACopyOf(dataRef.current);
        
        //it sets the ending alerts as false
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id == camera.id) {
                cam.pendingAlerts = false;
            }
            return cam;
        });
       
       saveData(copyData);
    }

    //it open the alert to delete the camera
    function deleteCamera() {
        
        Swal.fire({
            icon: "warning",
            title: "Deseja apagar essa câmera?",
            text: "Não será possível recuperar dados desta câmera",
            showCancelButton: true,
            confirmButtonColor: "#ce3b3bff",
            cancelButtonColor: "#5a5a5aff",
            cancelButtonText: "Voltar",
            confirmButtonText: "Sim, apagar!"
        }).then((result) => {
            if (result.isConfirmed) {

                //Message
                alert("success", "Câmera apagada", `A ${camera.name} foi apagada com sucesso`);
                
                let copyData = getACopyOf(data);
                
                //it updates the cameras array
                copyData.cameras = copyData.cameras.filter(cam => {
                    if (cam.id != camera.id) {
                        return cam;
                    }
                });

                saveData(copyData);

                //it sets the current and last views as dashboards
                setLastView("DashboardView");
                setCurrentView("DashboardView");
            }
        });
    }

    //it open the modal to update the camera
    function updateCamera() {
        setChoosenId(camera.id);
        setTypeModal("updateCamera");
        setShowModal(true);
    }

    //it creates an alert
    function createAlert() {

        const types = ["EPI", "invasion"];
        let copyData = getACopyOf(dataRef.current);

        //it gets the last alert id
        const lastAlert = copyData.alerts.at(-1);
        const lastId = lastAlert ? lastAlert.id : 0;

        // dame and time formats
        const date = moment().format('DD/MM/YYYY');
        const time = moment().format('HH:mm:ss');

        const alert = {
            id: lastId + 1,
            date: date,
            time: time,
            type: types[Math.round(Math.random())],
            img: `./alerts/cam${Math.ceil(Math.random() * 20)}.jpg`,
            x: xInitialObject.current,
            y: yInitialObject.current,
            w: xWidthObject.current,
            h: yWidthObject.current,
            createdByCamId: camera.id
        }

        //it updates the data
        copyData.alerts = [...copyData.alerts, alert];
        pendingAlertsRef.current = true; // to udpate the alert right away
        copyData.cameras = copyData.cameras.map((cam) => {
            if (cam.id == camera.id) {
                cam.pendingAlerts = true;
                cam.alerts = [...cam.alerts, alert.id];
            }
            return cam;
        });

        saveData(copyData);
    }

    return (

        <div className="camera-card">

            <div className="inner">
                <div onClick={openCamera} className={`cursor-pointer " + ${statusRef.current === "offline" ? "top offline" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "top online" : "top alerts"}`}>
                    <h5 className="title">{camera.name}</h5>
                    <span>{statusRef.current === "offline" ? "offline" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "online" : "alerta"} <div className={statusRef.current === "offline" ? "offline circle" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "online circle" : "alerta circle"}></div></span>
                </div>

                <div className="video-container">
                     {/* Streaming */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                    {/* Canvas for bounding boxes */}
                    <canvas
                        ref={canvasBoxRef}
                    />
                </div>

                <div className="bottom"></div>
            </div>


            {/* Settings dropdown */}
            <Dropdown align="end" className="options-camera">
                <Dropdown.Toggle>
                    <div className="icon settings "></div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item className="d-flex align-items-center" onClick={updateCamera}> <p className="me-2">Atualizar</p> <div className="ms-auto icon edit"></div></Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center" onClick={deleteCamera}> <p className="me-2">Apagar</p> <div className="ms-auto icon delete"></div></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>

    );
};

export default CameraCard;
