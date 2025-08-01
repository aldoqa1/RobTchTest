import { Toast, ToastContainer } from 'react-bootstrap';
import { GlobalContext } from '../context/GlobalContext';
import { useContext } from 'react';

function ToastGeneral() {

    const { showToast, setShowToast } = useContext(GlobalContext);

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide>
                <Toast.Header closeButton>
                    <strong className="me-auto">Notificação</strong>
                    <small>agora</small>
                </Toast.Header>
                <Toast.Body>Uma alerta foi criada.</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastGeneral;