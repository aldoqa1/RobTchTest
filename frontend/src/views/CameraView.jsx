import Hls from "hls.js";
import { useRef, useEffect, useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./../assets/css/views/cameraview.css";
import Swal from "sweetalert2";

function CameraView() {

    const { data, setData, choosenId, alert } = useContext(GlobalContext);

    //camera
    let camera = {};
    const videoRef = useRef();

    //canvas
    const canvasRef = useRef();
    const xInitial = useRef(0);
    const xWidth = useRef(0);
    const yInitial = useRef(0);
    const yWidth = useRef(0);
    const isDrawing = useRef(false);

    //restrict areas
    const [restrictStep, setRestrictStep] = useState("");
    const [restrictInput, setRestrictInput] = useState("");
    const restrictRef = useRef("");
    const [updatedId, setUpdatedId] = useState("");
    const [showRestrictAreas, setShowRestrictAreas] = useState(false);

    //setting current camera
    camera = data.cameras ? data.cameras.find(cam => cam.id === choosenId) : {};

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

        let copyData = JSON.parse(JSON.stringify(data));
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

        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

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
            setRestrictStep("save");
        }
    }

    //=============================== Create restrict area (end) =====================================//


    //=============================== Delete restrict area (start) =====================================//

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
                let copyData = JSON.parse(JSON.stringify(data));

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

                //setting the new data into memory
                setData(copyData);
                //saving the object in local storage
                localStorage.setItem('data', JSON.stringify(copyData));
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
        context.clearRect(0, 0, canvas.width, canvas.height);
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
            context.clearRect(0, 0, canvas.width, canvas.height);
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

        let copyData = JSON.parse(JSON.stringify(data));

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

        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

        //it finally resets the canvas
        closeRestrict();
        alert("success", "Área restrita atualizada", "A área estrita foi atualizada com sucesso");
    }

    //=============================== Update restrict area (end) =====================================//


    //it sets the camera online/offline/alert || camera
    function turningCamera(status) {

        let copyData = JSON.parse(JSON.stringify(data));
        copyData.cameras = copyData.cameras.map(cam => {
            if (cam.id === camera.id) {
                cam.status = status;
            }
            return cam;
        });
        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

    }

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

        //it turns the camera onlien by default
        turningCamera("online");

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (_event, info) => {
                console.error("HLS error:", info, _event);
                turningCamera("offline");
            });

            // It plays automatically the video
            const handlePause = () => {
                if (video.paused) {
                    turningCamera("online");
                    video.play().catch(err => {
                        console.warn("It is not possible to play the stream:", err);
                        turningCamera("offline");
                    });
                }
            };

            video.addEventListener("pause", handlePause);

            //This function clean the component by destroying the hls and deattaching the event listener (to free memory)
            return function cleanComponent() {
                hls.destroy();
                video.removeEventListener("pause", handlePause);
            };

        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.play();
        }

        //it sets true the drawing state when clicking
        function handleMouseDown(event) {
            isDrawing.current = true;
            yInitial.current = event.offsetY;
            xInitial.current = event.offsetX;
        }

        //it close the drawing state when pressing up
        function handleMouseUp() {
            isDrawing.current = false;
        }

        //it close the drawing state when leaving
        function handleMouseLeave() {
            isDrawing.current = false;
        }

        //It draws the restricted area
        function handleMouseMove(event) {
            if (!isDrawing.current) { return; }

            context.clearRect(0, 0, canvas.width, canvas.height);

            xWidth.current = event.offsetX - xInitial.current;
            yWidth.current = event.offsetY - yInitial.current;

            context.strokeRect(xInitial.current, yInitial.current, xWidth.current, yWidth.current);
            // text style
            context.font = "18px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "top";



            //Setting the area title
            context.fillText(restrictRef.current, (event.offsetX + xInitial.current) / 2, yInitial.current < event.offsetY ? yInitial.current + 10 : event.offsetY + 10);
        }

        //it cleans the component (removing the events in memory)
        return function cleanComponent() {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        }

    }, []);


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


    function setEPI(event, epiId){

        let copyData = JSON.parse(JSON.stringify(data));

        if(event.target.checked){
            
            copyData.cameras = copyData.cameras.map(cam => {
                if (cam.id == camera.id) {
                    cam.epis = [...cam.epis,epiId];
                }
                return cam;
            });

        }else{
                 
            copyData.cameras = copyData.cameras.map(cam => {
                if (cam.id == camera.id) {

                    cam.epis = cam.epis.filter((c)=> c != epiId);
    
                }
                return cam;
            });

        }

        //setting the new data into memory
        setData(copyData);
        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(copyData));

    }

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
                    <div className="name-area d-flex justify-content-between">

                        <h3 className="my-4">Áreas restritas</h3>

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

                        {(restrictStep === "save" || restrictStep === "update") && <span className="my-auto">Desenha tu área en el video!</span>}

                    </div>

                    <div className="areas">
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
                       
                        {data.epis && data.epis.length > 0 ? data.epis.map((epi)=>{

                            let checked = camera.epis.find(element => element == epi.id) || false;

                            return ( 
                            
                            <div key={epi.id} className={`${checked ? "checked " : "unchecked "} epi me-3 mt-3 align-items-center`}>{epi.name}<input className="ms-2" checked={checked} type="checkbox" onChange={(e)=>{setEPI(e,epi.id)}} /></div>
                        
                        )
                        }) 
                        :
                        <div>Sem epis</div>
                        }
                        
                    </div>
                </section>



                <section className="alerts">
                    <h3 className="my-4">Alertas</h3>
                    <div className="alert d-flex flex-column flex-sm-row px-4 mb-3">
                        <div className="img-container">
                            <img src="./alerts/cam1.jpg" alt="imagem alerta" />

                        </div>

                        <div className="d-flex flex-column ms-4">
                            <h4>Alerta 1</h4>
                            <p>Dia 4 de marco a las 3 pm</p>
                            <p>Alerta tipo EPI</p>
                        </div>
                    </div>

                    <div className="alert d-flex flex-column flex-sm-row px-4 mb-3">
                        <div className="img-container">
                            <img src="./alerts/cam2.jpg" alt="imagem alerta" />

                        </div>

                        <div className="d-flex flex-column ms-4">
                            <h4>Alerta 2</h4>
                            <p>Dia 4 de marco a las 3 pm</p>
                            <p>Alerta tipo EPI</p>
                        </div>
                    </div>
                </section>





            </div>

        </div>

    );
};

export default CameraView;
