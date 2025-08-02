import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale } from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale);

function AlertsLineChart({ filter }) {

    const [groupBy, setGroupBy] = useState("day"); // "day", "week", "month"
    
    const counts = {};

    const groupFormat = {
        day: "DD/MM/YYYY",
        week: "YYYY-[W]WW",
        month: "MM/YYYY"
    };

    // count alerts grouped by the selected time format (day, week, or month)
    filter.alerts.forEach(alert => {
        const alertDate = moment(alert.date, "DD/MM/YYYY");
        const groupKey = alertDate.format(groupFormat[groupBy]);

        if (!counts[groupKey]) {
            counts[groupKey] = 1;
        } else {
            counts[groupKey]++;
        }
    });

    // sort the group keys by date
    const sortedDates = Object.keys(counts).sort((a, b) => {
        const dateA = moment(a, groupFormat[groupBy]).toDate();
        const dateB = moment(b, groupFormat[groupBy]).toDate();
        return dateA - dateB;
    });

    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: `Alertas por ${groupBy === 'day' ? 'Dia' : groupBy === 'week' ? 'Semana' : 'Mês'}`,
                data: sortedDates.map(date => counts[date]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    };

    return (
        <div className='my-5 pt-sm-5 mb-5 pb-lg-5' style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h4 className="text-center mb-3">Quantidade de alertas</h4>
            <div className="d-flex justify-content-end mb-3 mt-4">
                <button className="button apply w-auto ms-3" onClick={() => setGroupBy("day")}>Por dia</button>
                <button className="button apply w-auto ms-3" onClick={() => setGroupBy("week")}>Por semana</button>
                <button className="button apply w-auto ms-3" onClick={() => setGroupBy("month")}>Por mês</button>
            </div>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 }
                        }
                    }
                }}
            />
        </div>
    );
}

export default AlertsLineChart;