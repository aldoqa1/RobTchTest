import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

function AlertTypePieChart({ filter }) {
  
  //object to count the type and setting the number of alarms each one
  const alertTypeCounts = {};

  filter.alerts.forEach(alert => {
    const type = alert.type;
 
    //it increments each type by one
    if (alertTypeCounts[type]) {
      alertTypeCounts[type] += 1;
    } else {
      alertTypeCounts[type] = 1;
    }
  });

  //it gets the labes and the number of alerts
  const labels = Object.keys(alertTypeCounts);
  const values = Object.values(alertTypeCounts);

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Alertas por tipo',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <h4 className="text-center mb-3 my-5 pt-sm-5">Distribuição de alertas por tipo</h4>
      <Pie data={pieData} />
    </div>
  );
}

export default AlertTypePieChart;