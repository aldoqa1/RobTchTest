import Hls from "hls.js";
import { useRef, useEffect, useContext } from "react";
import { GlobalContext } from "./../context/GlobalContext";
import "./../assets/css/pages/cameraPage.css";

function CameraPage() {

    let camera = {};
    const { data, setData, choosenId } = useContext(GlobalContext);
    const videoRef = useRef();
    const canvasRef = useRef();
    const xInitial = useRef(0);
    const yInitial = useRef(0);
    const isDrawing = useRef(false);
    
    //setting current camera
    camera = data.cameras ? data.cameras.find(cam => cam.id === choosenId) : {};

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
            context.strokeRect(xInitial.current, yInitial.current, event.offsetX - xInitial.current, event.offsetY - yInitial.current);

            // text style
            context.font = "18px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "top";

            //Setting the area title
            context.fillText("Restrict 1", (event.offsetX + xInitial.current) / 2, yInitial.current < event.offsetY ? yInitial.current + 10 : event.offsetY + 10);
        }

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
        
        const auxData = data;
        auxData.cameras = data.cameras.map(cam => {
            if (cam.id === camera.id) {
                cam.status = status;
            }
            return cam;
        });

        //setting the new data into memory
        setData(auxData);

        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(auxData));
    }

    return (

        <div>

            <h3>{camera.name} e {camera.status}</h3>

            <div className="videoContainer">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                />
                <canvas
                    ref={canvasRef}
                />
            </div>

        </div>

    );
};

export default CameraPage;
