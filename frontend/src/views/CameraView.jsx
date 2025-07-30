import Hls from "hls.js";
import { useRef, useEffect, useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./../assets/css/views/cameraview.css";

function CameraView() {

    let camera = {};
    const { data, setData, choosenId, alert } = useContext(GlobalContext);
    const videoRef = useRef();
    const canvasRef = useRef();
    const xInitial = useRef(0);
    const xWidth = useRef(0);
    const yInitial = useRef(0);
    const yWidth = useRef(0);
    const isDrawing = useRef(false);

    const [restrictStep, setRestrictStep] = useState("");
    const [restrictInput, setRestrictInput] = useState("");
    const restrictRef = useRef("");

    //setting current camera
    camera = data.cameras ? data.cameras.find(cam => cam.id === choosenId) : {};

    function openInput(){
        setRestrictStep("name"); 
    }

    function closeRestrict(){
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
    }

    function saveRestrict(){
        
        if(yInitial.current == 0 || xInitial.current == 0 || xWidth.current == 0 || yWidth.current == 0 ){
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
                    id: lastId+1,
                    name: restrictRef.current,
                    xinitial: xWidth.current,
                    yinitial: yWidth.current,
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

        closeRestrict();
    }

    function checkingAreaName(){
        if(restrictInput.trim().length<1){
            alert("error", "Erro no nome", "Nome esta vazio");
        }else{
            restrictRef.current = restrictInput;
            setRestrictStep("save");
        }
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


        function handleMouseDown(event) {
            isDrawing.current = true;
            yInitial.current = event.offsetY;
            xInitial.current = event.offsetX;
        }

        function handleMouseUp() {
            isDrawing.current = false;
        }

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

        return function cleanComponent() {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        }

    }, []);

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

                    <canvas className={restrictStep === "save" ? "d-block" : "d-none"}
                        ref={canvasRef}
                    />

                    {restrictStep === "save" && <button onClick={closeRestrict} className="cancel">Cancelar</button>}
                    {restrictStep === "save" &&  <button onClick={saveRestrict} className="save">Salvar</button>}
                    
                    
                </div>              
                
                <div className="check mt-3">
                    <input type="checkbox" />
                    <span className="ms-2">Mostrar areas restritas</span>
                </div>

                <div className="restricts">
                    <div className="name-area d-flex justify-content-between">
                        <h3 className="my-4">Areas restritas</h3>
                        {restrictStep === "" && <button onClick={openInput} className="add-area">Adicionar area restrita <div className="icon add d-inline-block ms-2"></div></button>}
                        {restrictStep === "name" && 
                            <div className="d-flex align-items-center">
                                <span className="me-2">Nome da area:</span>
                                <input placeholder="Area 1" type="text" value={restrictInput} onChange={(e)=>{setRestrictInput(e.target.value)}} />
                                <button className="border-0" onClick={checkingAreaName}><div className="icon add"></div></button>
                            </div>
                        }
                        {restrictStep === "save" && <span className="my-auto">Desenha tu area en el video!</span> }
                        
                    </div>

                    {camera.areas.length > 0 ? (
                    camera.areas.map((area) => (
                        <div onClick={()=>{
                            xWidth.current = area.xwidth;
                            yWidth.current = area.ywidth;
                            xInitial.current = area.xinitial;
                            yInitial.current = area.yinitial;
                            setRestrictInput(area.name);
                            restrictRef.current=area.name;
                            const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeRect(xInitial.current, yInitial.current, xWidth.current, yInitial.current);
            // text style
            context.font = "18px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "top";

        

            //Setting the area title
            context.fillText(restrictRef.current, (xInitial.current + xWidth.current + xInitial.current) / 2,  yWidth.current+10);

                        }} key={area.id}>{area.name}</div>
                    ))
                    ) : (
                    <div>Sem areas</div>
                    )}

                </div>

                <div className="alerts">
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
                </div>

            </div>

        </div>

    );
};

export default CameraView;
