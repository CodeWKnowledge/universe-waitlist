import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Toast from './shared/components/Toast';
import WaitlistApp from './WaitlistApp';
import FeaturePreviewPage from './FeaturePreviewPage';

export default function App() {
  // Global Alert State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WaitlistApp triggerToast={triggerToast} />} />
        <Route path="/features/:slug" element={<FeaturePreviewPage triggerToast={triggerToast} />} />
      </Routes>

      {/* Global Toast Alert Layer */}
      <Toast 
        message={toastMessage} 
        type={toastType} 
        onClose={() => setToastMessage('')} 
      />
    </BrowserRouter>
  );
}
