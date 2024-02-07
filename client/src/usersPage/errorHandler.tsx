import React, { useEffect } from 'react';
import { IAlertProps } from '../interface/data';

const Alert: React.FC<IAlertProps> = ({ message, type, dismissAlert }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            dismissAlert();
        }, 3000);

        return () => clearTimeout(timer); 
    }, [dismissAlert]);

    return (
        <div className={`alert ${type}`} role="alert">
        {message}
        <button onClick={dismissAlert}>Dismiss</button>
    </div>
    
    );
}

export default Alert;
