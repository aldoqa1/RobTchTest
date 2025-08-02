import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopCamChart({ filter }) {

    //it divides and sets the 5top cameras
    const [distributedData, setDistributedData] = useState({
        labels: [],
        datasets: [],
    });

    //when changing the alers or cameras, it will work out the distributed data
    useEffect(() => {

        if (!filter.alerts || !filter.cameras) return;

        const alerts = filter.alerts;
        const cameras = filter.cameras;
        const cameraCount = {};

        alerts.forEach((alert) => {
            const camId = alert.createdByCamId;
            if (camId) {
                cameraCount[camId] = (cameraCount[camId] || 0) + 1;
            }
        });

        //it gets the top 5 cameras
        const sorted = Object.entries(cameraCount)
            .map(([id, count]) => {
                const cam = cameras.find((c) => c.id === parseInt(id));
                return {
                    id,
                    count,
                    name: cam ? cam.name : `Câmera ${id}`,
                };
            })
            .sort((a, b) => b.count - a.count).slice(0, 5);

        //it sets the disributed data
        setDistributedData({
            labels: sorted.map((c) => c.name),
            datasets: [
                {
                    label: 'Número de alertas',
                    data: sorted.map((c) => c.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderWidth: 1,
                },
            ],
        });
    }, [filter.alerts, filter.cameras]);

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }} className='mt-5'>
            <h4 className="text-center mb-3">As câmeras com mais alertas</h4>
            <Bar
                data={distributedData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: false },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0,
                            },
                        },
                    },
                }}
            />
        </div>
    );
}

export default TopCamChart;