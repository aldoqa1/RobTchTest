import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalProvider } from './context/GlobalContext';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalProvider >
    <App />
  </GlobalProvider>
);
