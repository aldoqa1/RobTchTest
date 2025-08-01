import { useContext, useEffect, useState } from 'react';
import './../assets/css/views/dashboardview.css';
import CameraCard from '../components/CameraCard';
import { GlobalContext } from '../context/GlobalContext';


function DashboardView() {


    const { data, setData } = useContext(GlobalContext);

    //It gets the needed data
    function getData() {
        fetch("/API/API.json").then((response) => {
            response.json().then(data => {
                setData(data);

                //saving the object in local storage
                localStorage.setItem('data', JSON.stringify(data));

            });
        }
        ).catch(err => { setData({})});
    }

    //It gets all the data for the first time and it avoids if there is already data
    useEffect(() => {

        const storedData = localStorage.getItem('data');
        const jsonData = storedData ? JSON.parse(storedData) : null;

        if (jsonData) {
            setData(jsonData);
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
            <div onClick={()=>{                localStorage.setItem('data', JSON.stringify(null)); window.location.reload();}}>REINICIAR</div>

        </div>

    );
}

export default DashboardView;
