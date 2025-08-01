import './index.css';
import { GlobalContext } from './context/GlobalContext';
import { useContext } from 'react';
import ModalGeneral from './components/ModalGeneral';
import StatisticsView from './views/StatisticsView';
import ToastGeneral from './utilities/ToastGeneral';
import DashboardView from './views/DashboardView';
import AlertsView from './views/AlertsView';
import CameraView from './views/CameraView';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  const { currentView } = useContext(GlobalContext);

  return (
    <div className='container'>
      
      {/* Main components and vies */}  
      <Header />
      {currentView === "DashboardView" && <DashboardView />}
      {(currentView === "CameraView" || currentView === "CameraViewAlert") && <CameraView />}
      {currentView === "AlertsView" && <AlertsView />}
      {currentView === "StatisticsView" && <StatisticsView />}
      <Footer />

      {/* General components */}  
      <ModalGeneral />
      <ToastGeneral/>
    
    </div>
  );
}

export default App;
