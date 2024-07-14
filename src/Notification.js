// Notification.js

import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="notification-container">
      <div className="notification-content">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
