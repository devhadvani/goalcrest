import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// const ACTIVATE_URL = 'http://127.0.0.1:8000/auth/users/activation/';
const ACTIVATE_URL = `http://${window.location.hostname}:8000/auth/users/activation/`
const ActivatePage = () => {
    const [activationStatus, setActivationStatus] = useState(null);
    const [error, setError] = useState('');
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const activateAccount = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const userData = { uid, token };
            console.log(userData);
            const response = await axios.post(ACTIVATE_URL, userData, config);
            setActivationStatus(response.data.detail);
            console.log(response.data.detail);
            // If activation is successful, navigate to the login page. ok
            navigate('/login');
        } catch (error) {
            console.log(error);
            setError('Activation failed. Please try again.');
        }
    };

    return (
        <div className="container">
            {activationStatus && <p>{activationStatus}</p>}
            {error && <p>{error}</p>}
            <button onClick={activateAccount}>Activate Account</button>
        </div>
    );
};

export default ActivatePage;