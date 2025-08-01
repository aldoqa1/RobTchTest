import { GlobalContext } from '../context/GlobalContext';
import { useContext, useEffect } from 'react';
import CameraCard from '../components/CameraCard';


function DashboardView() {

    const { data, saveData } = useContext(GlobalContext);

    //It gets the needed data (the main data)
    function getData() {
        fetch("/API/API.json").then((response) => {
            response.json().then(data => {
                saveData(data);
            });
        }
        ).catch(err => { saveData({}) });
    }

    //It gets all the data for the first time and it avoids if there is already data
    useEffect(() => {

        const storedData = localStorage.getItem('data');
        const jsonData = storedData ? JSON.parse(storedData) : null;

        if (jsonData) {
            saveData(jsonData);
        } else {
            getData();
        }

    }, []);


    return (
        
        <div className='dashboard'>

            <div className="row g-3">
                {data.cameras && data.cameras.map(camera => (
                <div key={camera.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <CameraCard camera={camera} />
                </div>))}
            </div>
                






            <div onClick={()=>{console.log(data)}}>ver valor</div>
            <div onClick={()=>{                
                localStorage.setItem('data', JSON.stringify(null)); 
                window.location.reload();}}
            >REINICIAR</div>





        </div>

    );
}

export default DashboardView;
