import './index.css';
import DashboardView from './views/DashboardView';
import Header from './components/Header';
import Footer from './components/Footer';
import { GlobalContext } from './context/GlobalContext';
import { useContext } from 'react';
import CameraView from './views/CameraView';
import AlertsView from './views/AlertsView';
import StatisticsView from './views/StatisticsView';
import ModalGeneral from './components/ModalGeneral';
import ToastGeneral from './utilities/ToastGeneral';

function App() {

  const { currentView } = useContext(GlobalContext);

  return (
    <div className='container'>
      
      <Header />

      {currentView === "DashboardView" && <DashboardView />}
      {currentView === "CameraView" && <CameraView />}
      {currentView === "AlertsView" && <AlertsView />}
      {currentView === "StatisticsView" && <StatisticsView />}

      <Footer />
      
      <ModalGeneral />

      <ToastGeneral/>
    
    </div>
  );
}

export default App;
