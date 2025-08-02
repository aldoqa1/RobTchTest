import "./../assets/css/views/cameraview.css";
import { useRef, useEffect, useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import AlertCard from "../components/AlertCard";
import Swal from "sweetalert2";
import moment from "moment";
import Hls from "hls.js";



function CameraView() {

    const { data, choosenId, alert, setShowToast, currentView, saveData, getACopyOf } = useContext(GlobalContext);

    //choosenCamera
    let camera = {};

    //main variables
    const dataRef = useRef();
    const statusRef = useRef()
    const videoRef = useRef();
    const [updatedId, setUpdatedId] = useState("");

    //canvas variables
    const canvasRef = useRef();
    const canvasBoxRef = useRef();

    //drawing variables
    const xInitial = useRef(0);
    const xWidth = useRef(0);
    const yInitial = useRef(0);
    const yWidth = useRef(0);
    const isDrawing = useRef(false);
    const xInitialObject = useRef(0);
    const yInitialObject = useRef(0);
    const xWidthObject = useRef(0);
    const yWidthObject = useRef(0);

    //restrict areas
    const [restrictStep, setRestrictStep] = useState("");
    const [restrictInput, setRestrictInput] = useState("");
    const restrictRef = useRef("");
    const [showRestrictAreas, setShowRestrictAreas] = useState(false);


    //setting current camera
    if (currentView === "CameraView") {
        camera = data.cameras ? data.cameras.find(cam => cam.id === choosenId) : {};
    } else {
        const alert = data.alerts ? data.alerts.find(a => a.id === choosenId) : {};
        camera = data.cameras ? data.cameras.find(cam => cam.id === alert.createdByCamId) : {};
    }


    //=============================== Create restrict area (start) ===================================//

    //it opens de input || restrict area
    function openInput() {
        setShowRestrictAreas(false);
        setRestrictStep("name");
    }

    //it close and resets the canvas || restrict area
    function closeRestrict() {
        setRestrictStep("");
        setRestrictInput("");
        xInitial.current = 0;
        yInitial.current = 0;
        xWidth.current = 0;
        yWidth.current = 0;
        restrictRef.current = "";
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        setShowRestrictAreas(false);
    }

    //it saves the restrict area || restrict area
    function saveRestrict() {

        if (yInitial.current == 0 || xInitial.current == 0 || xWidth.current == 0 || yWidth.current == 0) {
            alert("error", "Erro de desenho", "Por favor de desenhar no video");
            return;
        }

        let copyData = getACopyOf(data);

        //it updates the cameras array by adding the restricted area
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id === camera.id) {

                //it gets the last id camera
                const lastArea = cam.areas.at(-1);
                const lastId = lastArea ? lastArea.id : 0;

                cam.areas.push({
                    id: lastId + 1,
                    name: restrictRef.current,
                    xinitial: xInitial.current,
                    yinitial: yInitial.current,
                    xwidth: xWidth.current,
                    ywidth: yWidth.current
                })
            }
            return cam;
        });

        saveData(copyData);

        //it finally resets the canvas
        closeRestrict();

        alert("success", "Área restrita criada", "A área estrita foi criada com sucesso");
    }

    //it checks the restrict new area name || restrict area
    function checkingAreaName() {
        if (restrictInput.trim().length < 1) {
            alert("error", "Erro no nome", "Nome esta vazio");
        } else {
            //it sets the area name
            restrictRef.current = restrictInput;
            //it septs into the last area to save the area
            setRestrictStep("save");
        }
    }

    //=============================== Create restrict area (end) =====================================//




    //=============================== Delete restrict area (start) =====================================//

    //it deletes a restrict area
    function deleteRestrictArea(area) {
        Swal.fire({

            icon: "warning",
            title: "Deseja apagar essa área?",
            text: "Não será possível recuperar dados dessa área",
            showCancelButton: true,
            confirmButtonColor: "#ce3b3bff",
            cancelButtonColor: "#5a5a5aff",
            cancelButtonText: "Voltar",
            confirmButtonText: "Sim, apagar!"

        }).then((result) => {
            if (result.isConfirmed) {

                //Message
                alert("success", "Área apagada", `A ${area.name} foi apagada com sucesso`);
                let copyData = getACopyOf(data);

                //it updates the cameras array by removing the restricted area
                copyData.cameras = copyData.cameras.map(cam => {
                    if (cam.id == choosenId) {

                        cam.areas = cam.areas.filter(a => {
                            if (a.id != area.id) {
                                return a;
                            }
                        });

                    }
                    return cam;
                });

                saveData(copyData);

                closeRestrict();
            }
        });
    }

    //=============================== Delete restrict area (end) =====================================//





    //=============================== Update restrict area (start) ===================================//

    //It sets all the data
    function openInputUpdate(area) {
        setUpdatedId(area.id);
        setRestrictInput(area.name);
        setRestrictStep("nameUpdate");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        restrictRef.current = area.name;
        xWidth.current = area.xwidth;
        yWidth.current = area.ywidth;
        xInitial.current = area.xinitial;
        yInitial.current = area.yinitial;

        //it cleans the canvas 
        context.clearRect(0, 0, canvas.width, canvas.height);

        //it draws the stroke rect
        context.strokeRect(xInitial.current, yInitial.current, xWidth.current, yWidth.current);

        //Setting text style
        context.font = "18px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "top";

        //Setting the area title
        context.fillText(restrictRef.current, (xInitial.current + xWidth.current / 2 + 10), yInitial.current < (yInitial.current + yWidth.current) ? yInitial.current + 10 : (yInitial.current + yWidth.current) + 10);
    }

    //it checks the restrict updated area name || restrict area
    function checkingAreaNameUpdate() {
        if (restrictInput.trim().length < 1) {
            alert("error", "Erro no nome", "Nome esta vazio");
        } else {
            restrictRef.current = restrictInput;
            setRestrictStep("update");
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            //cleaning the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            //wawing the stroke rect
            context.strokeRect(xInitial.current, yInitial.current, xWidth.current, yWidth.current);

            //Setting the area title
            context.fillText(restrictRef.current, (xInitial.current + xWidth.current / 2 + 10), yInitial.current < (yInitial.current + yWidth.current) ? yInitial.current + 10 : (yInitial.current + yWidth.current) + 10);
        }
    }

    //it update the restrict area || restrict area
    function updateRestrict() {

        if (yInitial.current == 0 || xInitial.current == 0 || xWidth.current == 0 || yWidth.current == 0) {
            alert("error", "Erro de desenho", "Por favor de desenhar no video");
            return;
        }

        const updatedArea = {
            id: updatedId,
            name: restrictRef.current,
            xinitial: xInitial.current,
            yinitial: yInitial.current,
            xwidth: xWidth.current,
            ywidth: yWidth.current
        }

        let copyData = getACopyOf(data);

        //it updates the cameras array by updating the restricted area
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id == choosenId) {

                cam.areas = cam.areas.map(c => {
                    if (c.id == updatedId) {
                        c = updatedArea;
                    }
                    return c;
                })
            }
            return cam;
        });

        saveData(copyData);

        //it finally resets the canvas
        closeRestrict();
        alert("success", "Área restrita atualizada", "A área estrita foi atualizada com sucesso");
    }

    //=============================== Update restrict area (end) =====================================//


    //it creates an alert
    function createAlert() {

        const types = ["EPI", "invasion"];
        let copyData = getACopyOf(dataRef.current);

        //it gets the last alert id
        const lastAlert = copyData.alerts.at(-1);
        const lastId = lastAlert ? lastAlert.id : 0;

        // time and date format
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

        //it adds an alert the the alerts array
        copyData.alerts = [...copyData.alerts, alert];

        //it updates the cameras array
        copyData.cameras = copyData.cameras.map((cam) => {
            if (cam.id == camera.id) {
                cam.alerts = [...cam.alerts, alert.id];
            }
            return cam;
        })

        saveData(copyData);

        setShowToast(true);
    }

    //it sets the epi to the epis of the camera
    function setEPI(event, epiId) {

        let copyData = getACopyOf(data);

        if (event.target.checked) {

            //it updates the cameras array (adding a epi to the list)
            copyData.cameras = copyData.cameras.map(cam => {
                if (cam.id == camera.id) {
                    cam.epis = [...cam.epis, epiId];
                }
                return cam;
            });

        } else {

            //it updates the cameras array (removing a epi to the list)
            copyData.cameras = copyData.cameras.map(cam => {
                if (cam.id == camera.id) {

                    cam.epis = cam.epis.filter((c) => c != epiId);

                }
                return cam;
            });

        }

        saveData(copyData);
    }

    //it sets the camera online/offline/alert
    function turningCamera(status) {

        let copyData = getACopyOf(data);

        //it updates the array of acameras
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id === camera.id) {
                cam.status = status;
            }
            return cam;
        });

        saveData(copyData);
    }



    //it sets and runs the interval
    useEffect(() => {

        //it focus the alerts when it is opened from the alerts view
        if (currentView !== "CameraView") {
            const elementId = `alert${choosenId}`; 
            const element = document.getElementById(elementId);

            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.focus(); 
            }
        }

        //random interval between min 30 seg - 3 min
        const interval = setInterval(() => {

            if (statusRef.current == "online") {
                const canvasBox = canvasBoxRef.current;
                const contextBox = canvasBox.getContext("2d");
                const container = canvasBox.parentElement;
                const w = canvasBox.width = container.clientWidth;
                const h = canvasBox.height = container.clientHeight;
                contextBox.lineWidth = 2;
                contextBox.strokeStyle = "yellow";

                //it sets the border when a alert is created
                const innerContainer = videoRef.current.parentElement;
                innerContainer.classList.add("border-alert");
                xInitialObject.current = Math.random() * 0.84 * w + 1;
                yInitialObject.current = Math.random() * 0.59 * h + 1;
                xWidthObject.current = w * .15;
                yWidthObject.current = h * .4;

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

        //it cleans the component (removing the events in memory)
        return function cleanComponent() {
            clearInterval(interval);
        }


    }, []);

    //when the status of the camera changes, this one tries to set the video in the case this one it's not online
    useEffect(() => {

        const src = camera.url;
        const video = videoRef.current;

        //Canvas
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        context.lineWidth = 2;
        context.strokeStyle = "red";

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);


        let hls = null;
        let handlePlaying = null;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);


            //when it detects its playing the video, it turns on the state
            handlePlaying = () => {
                turningCamera("online");
            };

            video.addEventListener("playing", handlePlaying);

        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.play();
        }

        //it cleans the component (removing the events in memory)
        return function cleanComponent() {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);

            if (hls) {
                hls.destroy();
            }

            if (handlePlaying) {
                video.removeEventListener("playing", handlePlaying);
            }



        }

        //it sets true the drawing state when clicking
        function handleMouseDown(event) {
            isDrawing.current = true;
            yInitial.current = event.offsetY;
            xInitial.current = event.offsetX;
        }

        //it closes the drawing state when pressing up
        function handleMouseUp() {
            isDrawing.current = false;
        }

        //it closes the drawing state when leaving
        function handleMouseLeave() {
            isDrawing.current = false;
        }

        //It draws the restricted area
        function handleMouseMove(event) {

            //it jsut draws if you are drawing
            if (!isDrawing.current) { return; }

            //it cleans the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            xWidth.current = event.offsetX - xInitial.current;
            yWidth.current = event.offsetY - yInitial.current;

            //it draws the the stroke react as moving the mouse
            context.strokeRect(xInitial.current, yInitial.current, xWidth.current, yWidth.current);

            // text style
            context.font = "18px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "top";

            //Setting the area title
            context.fillText(restrictRef.current, (event.offsetX + xInitial.current) / 2, yInitial.current < event.offsetY ? yInitial.current + 10 : event.offsetY + 10);
        }

    }, [camera.status]);

    //when showRestricAreas changes by using an loop it will print the restricted areas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (showRestrictAreas) {
            camera.areas.forEach(area => {
                // text style
                context.font = "18px Arial";
                context.fillStyle = "white";
                context.textAlign = "center";
                context.textBaseline = "top";
                //Setting the area title
                context.fillText(area.name, (area.xinitial + area.xwidth / 2 + 10), area.yinitial < (area.yinitial + area.ywidth) ? area.yinitial + 10 : (area.yinitial + area.ywidth) + 10);
                context.strokeRect(area.xinitial, area.yinitial, area.xwidth, area.ywidth);
            });
        }
    }, [showRestrictAreas]);

    //when the data variable is updating data and status ref get the current value 
    useEffect(() => {
        dataRef.current = data;
        statusRef.current = camera.status;
    }, [data]);

    //when curentview changes the dataRef variable gets the current value
    useEffect(() => {
        dataRef.current = data;
    }, [currentView]);



    return (

        <div className="row camera-view">

            <div className="col-12">
                <div className="title">
                    <h2 className="text-center">{camera.name}</h2>
                    <span className={`ms-auto fw-bold ${camera.status}`}>{camera.status} <div className="circle"></div></span>
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

                    <canvas className={(restrictStep === "save" || restrictStep === "update" || showRestrictAreas) ? "d-block" : "d-none"}
                        ref={canvasRef}
                    />

                    {(restrictStep === "save" || restrictStep === "update") && <button onClick={closeRestrict} className="cancel">Cancelar</button>}
                    {restrictStep === "save" && <button onClick={saveRestrict} className="save">Salvar</button>}
                    {restrictStep === "update" && <button onClick={updateRestrict} className="save">Atualizar</button>}

                </div>

                <div className="check mt-3">
                    <input checked={showRestrictAreas} onChange={(e) => { setShowRestrictAreas(e.target.checked) }} type="checkbox" />
                    <span className="ms-2">Mostrar áreas restritas</span>
                </div>

                <section className="restricts">
                    <div className="name-area d-flex flex-column flex-sm-row justify-content-between">

                        <h3 className="my-2">Áreas restritas</h3>

                        {restrictStep === "" && <button onClick={openInput} className="add-area">Adicionar área restrita <div className="icon add d-inline-block ms-2"></div></button>}

                        {restrictStep === "name" &&
                            <div className="d-flex align-items-center">
                                <span className="me-2">Nome da área:</span>
                                <input placeholder="Área 1" type="text" value={restrictInput} onChange={(e) => { setRestrictInput(e.target.value) }} />
                                <button className="border-0" onClick={checkingAreaName}><div className="icon add"></div></button>
                            </div>
                        }

                        {restrictStep === "nameUpdate" &&
                            <div className="d-flex align-items-center">
                                <span className="me-2">Nome da área:</span>
                                <input placeholder="Área 1" type="text" value={restrictInput} onChange={(e) => { setRestrictInput(e.target.value) }} />
                                <button className="border-0" onClick={checkingAreaNameUpdate}><div className="icon edit"></div></button>
                            </div>
                        }

                        {(restrictStep === "save" || restrictStep === "update") && <span className="my-auto">Desenhe sua área no vídeo!</span>}

                    </div>

                    <div className="areas mt-3">
                        {camera.areas.length > 0 ? (
                            camera.areas.map((area) => (
                                <div className="area" key={area.id}>{area.name} <button onClick={() => { openInputUpdate(area) }} className="ms-2 icon edit"></button> <button onClick={() => { deleteRestrictArea(area) }} className="icon delete"></button> </div>
                            ))
                        ) : (
                            <div>Sem áreas restritas</div>
                        )}
                    </div>


                </section>


                <section className="epis">
                    <h3 className="my-4">EPIS</h3>
                    <div>

                        {data.epis && data.epis.length > 0 ? data.epis.map((epi) => {

                            let checked = camera.epis.find(element => element == epi.id) || false;

                            return (

                                <div key={epi.id} className={`${checked ? "checked " : "unchecked "} epi me-3 mt-3 align-items-center`}>{epi.name}<input className="ms-2" checked={checked} type="checkbox" onChange={(e) => { setEPI(e, epi.id) }} /></div>

                            )
                        })
                            :
                            <div>Sem epis</div>
                        }

                    </div>
                </section>



                <section className="alerts">
                    <h3 className="my-4 pt-3">Alertas</h3>


                    {

                        camera.alerts && camera.alerts.length > 0 ? [...camera.alerts].reverse().map((a, idx) => {

                            let foundAlert = data.alerts.find(element => element.id == a) || {};


                            return (
                                <div id={"alert" + foundAlert.id} key={foundAlert.id + "alertUnique" + camera.id}><AlertCard foundAlert={foundAlert} camera={camera} idx={idx} /></div>
                            )
                        })
                            :
                            <div>Sem alertas</div>
                    }

                </section>





            </div>


        </div>

    );
};

export default CameraView;
