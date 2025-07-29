import { useContext, useEffect, useState } from 'react';
import './../assets/css/pages/dashboardPage.css';
import CameraCard from '../components/CameraCard';
import { GlobalContext } from '../context/GlobalContext';

function DashboardPage() {


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
        ).catch(err => { console.log(err) });
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

            <div className="grid">
                {data.cameras && data.cameras.map(camera => {
                    return <CameraCard key={camera.id} camera={camera} />
                })}
            </div>

        </div>

    );
}

export default DashboardPage;
