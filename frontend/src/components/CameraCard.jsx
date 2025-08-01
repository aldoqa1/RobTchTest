import Hls from "hls.js";
import { useRef, useEffect, useContext } from "react";
import { GlobalContext } from "./../context/GlobalContext";
import "./../assets/css/components/cameracard.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from "sweetalert2";
import moment from "moment";

function CameraCard({ camera }) {

    const { data, setData, setCurrentView, setLastView, currentView, setChoosenId, alert, setTypeModal, setShowModal } = useContext(GlobalContext);
    const videoRef = useRef();
    const dataRef = useRef(data);
    const canvasBoxRef = useRef();
    const statusRef = useRef("");
    const pendingAlertsRef=useRef("")

        const xInitialObject = useRef(0);
    const yInitialObject = useRef(0);
    const xWidthObject = useRef(0);
    const yWidthObject = useRef(0);

    //it gets the current data value 
    useEffect(() => {
        dataRef.current = data;
        statusRef.current = data.cameras.find(c => c.id == camera.id).status;
        pendingAlertsRef.current = data.cameras.find(c => c.id == camera.id).pendingAlerts;
    }, [data]);
    


    useEffect(() => {

        const src = camera.url;
        const video = videoRef.current;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            //when it starts it turns the video online
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

    useEffect(() => {
        //random interval between min 3 min - 6 min
        const interval = setInterval(() => {

            if (statusRef.current == "online") {
                const canvasBox = canvasBoxRef.current;
                const contextBox = canvasBox.getContext("2d");
                const container = canvasBox.parentElement;
                const w = canvasBox.width = container.clientWidth;
                const h = canvasBox.height = container.clientHeight;
                contextBox.lineWidth = 2;
                contextBox.strokeStyle = "yellow";

                const innerContainer = videoRef.current.parentElement.parentElement;
                innerContainer.classList.add("border-alert");
                                xInitialObject.current= Math.random() * 0.84 * w + 1;
                yInitialObject.current= Math.random() * 0.59 * h + 1;
                xWidthObject.current= w * .15;
                yWidthObject.current= h * .4;
                contextBox.strokeRect(xInitialObject.current, yInitialObject.current, xWidthObject.current, yWidthObject.current);
                createAlert();


                setTimeout(() => {
                    contextBox.clearRect(0, 0, canvasBox.width, canvasBox.height);
                    innerContainer.classList.remove("border-alert");
                }, 10000);


            }

        }, Math.random() * 18000 + 2000);


        return function cleanComponent() {
            clearInterval(interval);
        };
    }, []);

    function turningCamera(status) {

        let copyData = JSON.parse(JSON.stringify(data));
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id == camera.id) {
                cam.status = status;
            }
            return cam;
        });
        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

    }

    function openCamera() {

        setCurrentView("CameraView");
        setLastView(currentView);
        setChoosenId(camera.id);
             let copyData = JSON.parse(JSON.stringify(dataRef.current));
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id == camera.id) {
                cam.pendingAlerts = false;
            }
            return cam;
        });
        //setting the new data into memory

        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));
    }

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
                let copyData = JSON.parse(JSON.stringify(data));
                copyData.cameras = copyData.cameras.filter(cam => {
                    if (cam.id != camera.id) {
                        return cam;
                    }
                });
                //setting the new data into memory
                setData(copyData);
                //saving the object in local storage
                localStorage.setItem('data', JSON.stringify(copyData));
                setLastView("DashboardView");
                setCurrentView("DashboardView");
            }
        });
    }

    function updateCamera() {

        setChoosenId(camera.id);
        setTypeModal("updateCamera");
        setShowModal(true);

    }


    function createAlert() {

        const types = ["EPI", "invasion"];
        let copyData = JSON.parse(JSON.stringify(dataRef.current));

        //it gets the last id epi
        const lastAlert = copyData.alerts.at(-1);
        const lastId = lastAlert ? lastAlert.id : 0;

        // date format "DD/MM/YYYY"
        const date = moment().format('DD/MM/YYYY');

        // time format "HH:mm:ss"
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
            h: yWidthObject.current
        }

        copyData.alerts = [...copyData.alerts, alert];
        pendingAlertsRef.current = true; // to udpate the alert right away
        copyData.cameras = copyData.cameras.map((cam) => {
            if (cam.id == camera.id) {
                cam.pendingAlerts = true;
                cam.alerts = [...cam.alerts, alert.id];
            }
            return cam;
        })
        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));
    }

    return (

        <div className="camera-card">

            <div className="inner">
                <div onClick={openCamera} className={`cursor-pointer " + ${statusRef.current === "offline" ? "top offline" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "top online" : "top alerts"}`}>
                    <h5 className="title">{camera.name}</h5>
                    <span>{statusRef.current === "offline" ? "offline" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "online" : "alerta"} <div className={statusRef.current === "offline" ? "offline circle" : (statusRef.current === "online" && !pendingAlertsRef.current) ? "online circle" : "alerta circle"}></div></span>
                </div>

                <div className="video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasBoxRef}
                    />
                </div>

                <div className="bottom"></div>
            </div>



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
