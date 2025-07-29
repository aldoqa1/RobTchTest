import Hls from "hls.js";
import { useRef, useEffect, useContext } from "react";
import { GlobalContext } from "./../context/GlobalContext";
import "./../assets/css/components/cameraCard.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from "sweetalert2";

function CameraCard({ camera }) {

    const { data, setData, setCurrentPage, setLastPage, currentPage, setChoosenId, alert, setTypeModal, setShowModal } = useContext(GlobalContext);
    const videoRef = useRef();

    useEffect(() => {

        const src = camera.url;
        const video = videoRef.current;

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

    }, []);

    function turningCamera(status) {
        //setData(data);
        const auxData = data;
        auxData.cameras = data.cameras.map(cam => {
            if (cam.id === camera.id) {
                cam.status = status;
            }
            return cam;
        });

        setData(auxData);

        //saving the object in local storage
        localStorage.setItem('data', JSON.stringify(auxData));
    }

    function openCamera() {
        setCurrentPage("CameraPage");
        setLastPage(currentPage);
        setChoosenId(camera.id);
    }

    function deleteCamera() {
        Swal.fire({
            icon: "warning",
            title: "Deseja apagar essa câmera",
            text: "Não será possível recuperar dados desta câmera",
            showCancelButton: true,
            confirmButtonColor: "#ce3b3bff",
            cancelButtonColor: "#5a5a5aff",
            cancelButtonText: "Voltar",
            confirmButtonText: "Sim, apagar!"
        }).then((result) => {
            if (result.isConfirmed) {
                alert("success", "Câmera apagada", `A ${camera.name} foi apagada com sucesso`);
                setLastPage("DashboardPage");
                setCurrentPage("DashboardPage");
            }
        });
    }

    function updateCamera() {
        setChoosenId(camera.id);
        setTypeModal("updateCamera");
        setShowModal(true);
    }

    return (

        <div className="cameraCard">

            <div className="inner">
                <div onClick={openCamera} className={`cursor-pointer " + ${camera.status === "online" ? "top online" : camera.status === "offline" ? "top offline" : "top alerts"}`}>
                    <h5 className="title">{camera.name}</h5>
                    <span>{camera.status} <div className={camera.status === "online" ? "circle online" : camera.status === "offline" ? "circle offline" : "circle alerts"}></div></span>
                </div>

                <div className="videoContainer">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                </div>

                <div className="bottom">


                </div>
            </div>



            <Dropdown align="end" className="optionsCamera">
                <Dropdown.Toggle variant="primary" id="dropdown-basic" >
                    <div className="icon settings "></div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item className="fw-bold d-flex align-items-center" onClick={updateCamera}>Atualizar <div className="icon edit"></div></Dropdown.Item>
                    <Dropdown.Item className="fw-bold d-flex align-items-center" onClick={deleteCamera}>Apagar <div className="icon delete"></div></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>

    );
};

export default CameraCard;
