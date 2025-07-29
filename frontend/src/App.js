import './index.css';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { GlobalContext } from './context/GlobalContext';
import { useContext } from 'react';
import CameraPage from './pages/CameraPage';
import AlertsPage from './pages/AlertsPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {

  const { currentPage } = useContext(GlobalContext);

  return (
    <div className='container'>
      <Header />

      {currentPage === "DashboardPage" && <DashboardPage />}
      {currentPage === "CameraPage" && <CameraPage />}
      {currentPage === "AlertsPage" && <AlertsPage />}
      {currentPage === "StatisticsPage" && <StatisticsPage />}

      <Footer />
    </div>
  );
}

export default App;
